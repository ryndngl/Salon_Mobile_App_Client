// utils/FavoritesMigrationHelper.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export class FavoritesMigrationHelper {
  
  // Migrate old global favorites to user-specific storage
  static async migrateGlobalFavoritesToUser(userId) {
    try {
      if (!userId) {
        console.warn('Cannot migrate: No user ID provided');
        return false;
      }

      // Check if user already has favorites
      const userFavoritesKey = `favorites_${userId}`;
      const existingUserFavorites = await AsyncStorage.getItem(userFavoritesKey);
      
      if (existingUserFavorites) {
        console.log('User already has favorites, skipping migration');
        return false;
      }

      // Get old global favorites
      const globalFavorites = await AsyncStorage.getItem('favorites');
      
      if (!globalFavorites) {
        console.log('No global favorites to migrate');
        return false;
      }

      // Parse and validate
      const parsedFavorites = JSON.parse(globalFavorites);
      const validFavorites = parsedFavorites.filter(
        fav => fav?.service?.name && fav?.name && fav?.price
      );

      if (validFavorites.length === 0) {
        console.log('No valid favorites to migrate');
        return false;
      }

      // Add userId to each favorite
      const migratedFavorites = validFavorites.map(fav => ({
        ...fav,
        userId: userId,
        migratedAt: new Date().toISOString()
      }));

      // Save to user-specific storage
      await AsyncStorage.setItem(userFavoritesKey, JSON.stringify(migratedFavorites));
      
      console.log(`Successfully migrated ${migratedFavorites.length} favorites to user ${userId}`);
      
      // Optionally remove global favorites after migration
      // await AsyncStorage.removeItem('favorites');
      
      return true;
    } catch (error) {
      console.error('Migration failed:', error);
      return false;
    }
  }

  // Clean up old global favorites (use with caution)
  static async cleanupGlobalFavorites() {
    try {
      await AsyncStorage.removeItem('favorites');
      console.log('Global favorites removed');
      return true;
    } catch (error) {
      console.error('Failed to cleanup global favorites:', error);
      return false;
    }
  }

  // Get all user-specific favorite keys
  static async getAllUserFavoriteKeys() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter(key => key.startsWith('favorites_'));
    } catch (error) {
      console.error('Failed to get user favorite keys:', error);
      return [];
    }
  }

  // Get favorites count for all users
  static async getFavoritesStatistics() {
    try {
      const userFavoriteKeys = await this.getAllUserFavoriteKeys();
      const stats = {};
      
      for (const key of userFavoriteKeys) {
        const userId = key.replace('favorites_', '');
        const favorites = await AsyncStorage.getItem(key);
        
        if (favorites) {
          const parsed = JSON.parse(favorites);
          stats[userId] = {
            count: parsed.length,
            lastModified: Math.max(...parsed.map(f => 
              new Date(f.timestamp || f.migratedAt || 0).getTime()
            ))
          };
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return {};
    }
  }

  // Backup user favorites
  static async backupUserFavorites(userId) {
    try {
      const userFavoritesKey = `favorites_${userId}`;
      const favorites = await AsyncStorage.getItem(userFavoritesKey);
      
      if (!favorites) {
        console.log('No favorites to backup for user:', userId);
        return null;
      }

      const backupKey = `favorites_backup_${userId}_${Date.now()}`;
      await AsyncStorage.setItem(backupKey, favorites);
      
      console.log('Backup created:', backupKey);
      return backupKey;
    } catch (error) {
      console.error('Backup failed:', error);
      return null;
    }
  }

  // Restore user favorites from backup
  static async restoreUserFavorites(backupKey) {
    try {
      const backupData = await AsyncStorage.getItem(backupKey);
      
      if (!backupData) {
        console.log('No backup data found:', backupKey);
        return false;
      }

      // Extract userId from backup key
      const match = backupKey.match(/favorites_backup_(.+)_\d+/);
      if (!match) {
        console.error('Invalid backup key format:', backupKey);
        return false;
      }

      const userId = match[1];
      const userFavoritesKey = `favorites_${userId}`;
      
      await AsyncStorage.setItem(userFavoritesKey, backupData);
      
      console.log('Favorites restored for user:', userId);
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }
}

// Usage examples:
/*
// In your AuthContext login function:
const login = async (email, password) => {
  // ... existing login code ...
  
  if (data.isSuccess && data.token) {
    const userId = data.user._id || data.user.id;
    
    // Try to migrate old favorites
    await FavoritesMigrationHelper.migrateGlobalFavoritesToUser(userId);
    
    // ... rest of login code ...
  }
};

// In development/testing:
const stats = await FavoritesMigrationHelper.getFavoritesStatistics();
console.log('Favorites stats:', stats);

// For admin panel:
const backupKey = await FavoritesMigrationHelper.backupUserFavorites(userId);
*/