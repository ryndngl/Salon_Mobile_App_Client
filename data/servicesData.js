// servicesData.js - Fixed version
const services = [
  // HAIR CUT SERVICES
  {
    id: 1,
    name: "Hair Cut",
    styles: [
      // MEN
      {
        id: 1,
        name: "Buzz Cut",
        category: "Men",
        price: 100,
        description:
          "A low-maintenance, clean and even haircut perfect for a fresh look.",
        image: require("../assets/Haircut/Men/Buzz Cut.webp"),
      },
      {
        id: 2,
        name: "High Fade",
        category: "Men",
        price: 100,
        description:
          "A sharp fade from the sides up to the top for a sleek and modern style.",
        image: require("../assets/Haircut/Men/High fade.webp"),
      },
      {
        id: 3,
        name: "Crew Cut",
        category: "Men",
        price: 100,
        description:
          "A classic short cut with a neat finish, great for any occasion.",
        image: require("../assets/Haircut/Men/Crewcut.webp"),
      },
      {
        id: 4,
        name: "Fohawk",
        category: "Men",
        price: 100,
        description:
          "A bold style with short sides and a strip of longer hair down the middle.",
        image: require("../assets/Haircut/Men/Fohawk.webp"),
      },
      {
        id: 5,
        name: "French Crop",
        category: "Men",
        price: 100,
        description:
          "A short, textured cut with a neat fringe for a stylish finish.",
        image: require("../assets/Haircut/Men/French Crop.webp"),
      },
      {
        id: 6,
        name: "Side Part",
        category: "Men",
        price: 100,
        description:
          "A timeless cut with a defined side part for a polished look.",
        image: require("../assets/Haircut/Men/Side Part.webp"),
      },
      {
        id: 7,
        name: "Taper Fade Mohawk",
        category: "Men",
        price: 100,
        description:
          "A mohawk with a smooth taper fade for a clean yet edgy style.",
        image: require("../assets/Haircut/Men/Taper Fade Mohawk.webp"),
      },
      {
        id: 8,
        name: "Textured Comb Over",
        category: "Men",
        price: 100,
        description:
          "A voluminous comb-over with added texture for a modern vibe.",
        image: require("../assets/Haircut/Men/Textured-Comb-Over.webp"),
      },
      {
        id: 9,
        name: "Two Block",
        category: "Men",
        price: 100,
        description:
          "A trendy cut with short sides and longer top layers for contrast.",
        image: require("../assets/Haircut/Men/Two Block.webp"),
      },
      {
        id: 10,
        name: "Burst Fade", 
        category: "Men",
        price: 100,
        description:
          "A rounded fade that curves around the ear for a unique look.",
        image: require("../assets/Haircut/Men/Burst Fade.webp"),
      },
      {
        id: 11,
        name: "Curtain Fringe",
        category: "Men",
        price: 100,
        description:
          "A parted fringe style for a relaxed, youthful appearance.",
        image: require("../assets/Haircut/Men/Curtain Fringe.webp"),
      },
      {
        id: 12,
        name: "Army Cut",
        category: "Men",
        price: 100,
        description:
          "A very short, military-inspired haircut for a sharp and clean style.",
        image: require("../assets/Haircut/Men/Army Cut.webp"),
      },

      // WOMEN
      {
        id: 1,
        name: "Boy Cut",
        category: "Women",
        price: 100,
        description:
          "A short, androgynous style that's bold and easy to maintain.",
        image: require("../assets/Haircut/Women/Boy Cut.webp"),
      },
      {
        id: 2,
        name: "Butterfly Cut",
        category: "Women",
        price: 100,
        description: "Layered waves with volume, giving a light and airy look.",
        image: require("../assets/Haircut/Women/Butterfly Cut.webp"),
      },
      {
        id: 3,
        name: "Fluffy Waves Bob",
        category: "Women",
        price: 100,
        description:
          "A soft bob with gentle waves for a fresh, chic appearance.",
        image: require("../assets/Haircut/Women/Fluffy Waves Bob.webp"),
      },
      {
        id: 4,
        name: "Layered Curls",
        category: "Women",
        price: 100,
        description:
          "Bouncy curls with layered volume for a lively, stylish look.",
        image: require("../assets/Haircut/Women/Layered Curls with Bangs.webp"),
      },
      {
        id: 5,
        name: "Layered",
        category: "Women",
        price: 100,
        description: "A versatile layered cut for movement and shape.",
        image: require("../assets/Haircut/Women/Layered.webp"),
      },
      {
        id: 6,
        name: "Long Layered",
        category: "Women",
        price: 100,
        description: "Long layers that add dimension and flow to your hair.",
        image: require("../assets/Haircut/Women/Long Layered.webp"),
      },
      {
        id: 7,
        name: "Middy",
        category: "Women",
        price: 100,
        description: "A mid-length cut with soft edges for a feminine style.",
        image: require("../assets/Haircut/Women/Middy.webp"),
      },
      {
        id: 8,
        name: "Short",
        category: "Women",
        price: 100,
        description: "A simple, short haircut that's fresh and easy to style.",
        image: require("../assets/Haircut/Women/Short.webp"),
      },
      {
        id: 9,
        name: "Soft and Pixie Cut",
        category: "Women",
        price: 100,
        description:
          "A pixie cut with soft texture for a playful, modern look.",
        image: require("../assets/Haircut/Women/Soft and Pixie Cut.webp"),
      },
      {
        id: 10,
        name: "Textured Bob",
        category: "Women",
        price: 100,
        description:
          "A bob with added texture and bangs for a chic, trendy vibe.",
        image: require("../assets/Haircut/Women/Textured Bob and Wispy Bangs.webp"),
      },
      {
        id: 11,
        name: "V Cut",
        category: "Women",
        price: 100,
        description: "Long layers cut in a V-shape for a sleek finish.",
        image: require("../assets/Haircut/Women/V Cut.webp"),
      },
      {
        id: 12,
        name: "Wolf Cut Mallet",
        category: "Women",
        price: 100,
        description: "A bold, edgy cut mixing mullet and shag styles.",
        image: require("../assets/Haircut/Women/Wolf Cut Mullet.webp"),
      },
      {
        id: 13,
        name: "Wolf Cut",
        category: "Women",
        price: 100,
        description: "A trendy shaggy cut with layers and volume.",
        image: require("../assets/Haircut/Women/Wolf Cut.webp"),
      },
      {
        id: 14,
        name: "Bangs",
        category: "Women",
        price: 100,
        description:
          "Frontal fringe that frames the face for a youthful touch.",
        image: require("../assets/Haircut/Women/Bangs.webp"),
      },
      {
        id: 15,
        name: "Side swept",
        category: "Women",
        price: 100,
        description: "Side-swept fringe for a soft, romantic look.",
        image: require("../assets/Haircut/Women/Side swept.webp"),
      },
      {
        id: 16,
        name: "Balayage",
        category: "Women",
        price: 100,
        description:
          "A highlighting technique for a natural sun-kissed effect.",
        image: require("../assets/Haircut/Women/Balayage.webp"),
      },

      // KIDS
      {
        id: 1,
        name: "Army Cut",
        category: "Kids",
        price: 100,
        description: "A neat, short haircut perfect for active kids.",
        image: require("../assets/Haircut/Kids/Army Cut.webp"),
      },
      {
        id: 2,
        name: "Bowl Cut",
        category: "Kids",
        price: 100,
        description:
          "A rounded cut with even length for a cute, classic style.",
        image: require("../assets/Haircut/Kids/Bowl Cut.webp"),
      },
      {
        id: 3,
        name: "Little Buzz",
        category: "Kids",
        price: 100,
        description: "Very short and even, easy to maintain for kids.",
        image: require("../assets/Haircut/Kids/Buzz Cut.webp"),
      },
      {
        id: 4,
        name: "Comb Over Cut",
        category: "Kids",
        price: 100,
        description: "Short sides with a neat combed top for a polished look.",
        image: require("../assets/Haircut/Kids/Comb Over Cut.webp"),
      },
      {
        id: 5,
        name: "Pompadour",
        category: "Kids",
        price: 100,
        description:
          "A stylish top with volume, perfect for special occasions.",
        image: require("../assets/Haircut/Kids/Pompadour.webp"),
      },
      {
        id: 6,
        name: "Fade",
        category: "Kids",
        price: 100,
        description:
          "Short sides fading into longer top hair for a fresh look.",
        image: require("../assets/Haircut/Kids/Fade.webp"),
      },
      {
        id: 7,
        name: "Fringe Fade",
        category: "Kids",
        price: 100,
        description: "A fade with front fringe for a modern, playful vibe.",
        image: require("../assets/Haircut/Kids/Fringe Fade.webp"),
      },
      {
        id: 8,
        name: "Little Fade",
        category: "Kids",
        price: 100,
        description: "High contrast fade for a sharp and trendy style.",
        image: require("../assets/Haircut/Kids/High Fade.webp"),
      },
      {
        id: 9,
        name: "Mid Fade",
        category: "Kids",
        price: 100,
        description: "Balanced fade starting mid-way up the head.",
        image: require("../assets/Haircut/Kids/Mid Fade.webp"),
      },
      {
        id: 10,
        name: "Mohawk",
        category: "Kids",
        price: 100,
        description: "Bold style with shaved sides and a strip of long hair.",
        image: require("../assets/Haircut/Kids/Mohawk.webp"),
      },
      {
        id: 11,
        name: "Side Part Cut",
        category: "Kids",
        price: 100,
        description: "Classic side part style for a clean, smart look.",
        image: require("../assets/Haircut/Kids/Side Part Cut.webp"),
      },
    ],
  },

  // HAIR COLOR SERVICES
  {
    id: 2,
    name: "Hair Color",
    styles: [
      // ROOT TOUCH UP CATEGORY
      {
        id: 1,
        name: "Medium Brown",
        category: "Root Touch Up",
        price: 499,
        description: "Ideal for covering roots on medium brown hair.",
        image: require("../assets/Hair Color/Medium Brown.webp"),
      },
      {
        id: 2,
        name: "Light Blonde",
        category: "Root Touch Up",
        price: 499,
        description:
          "Used to seamlessly blend darker roots into light blonde hair.",
        image: require("../assets/Hair Color/Light Blonde.webp"),
      },
      {
        id: 3,
        name: "Black",
        category: "Root Touch Up",
        price: 499,
        description:
          " Perfect for concealing regrowth on natural or dyed black hair.",
        image: require("../assets/Hair Color/Black.webp"),
      },
      {
        id: 4,
        name: "Auburn Tones",
        category: "Root Touch Up",
        price: 499,
        description:
          "Designed to match and blend with reddish-brown auburn hair colors.",
        image: require("../assets/Hair Color/Auburn tones.webp"),
      },
      {
        id: 5,
        name: "Dark Brown",
        category: "Root Touch Up",
        price: 499,
        description: "For quick and easy root coverage on dark brown hair.",
        image: require("../assets/Hair Color/Dark Brown.webp"),
      },

      // FULL HAIR CATEGORY
      {
        id: 1,
        name: "Inky Grey",
        category: "Full Hair",
        price: 699,
        description: "A deep grey shade with a sleek and mysterious allure.",
        image: require("../assets/Hair Color/Inky Grey.webp"),
      },
      {
        id: 2,
        name: "Blonde",
        category: "Full Hair",
        price: 699,
        description:
          "A bright, golden tone that adds warmth and radiance to your look.",
        image: require("../assets/Hair Color/Blonde.webp"),
      },
      {
        id: 3,
        name: "Purple",
        category: "Full Hair",
        price: 699,
        description: "Bold and playful purple for a unique and creative style.",
        image: require("../assets/Hair Color/Purple.webp"),
      },
      {
        id: 4,
        name: "Chestnut Brown",
        category: "Full Hair",
        price: 699,
        description: "A warm brown shade with subtle reddish undertones.",
        image: require("../assets/Hair Color/Chestnut Brown.webp"),
      },
      {
        id: 5,
        name: "Plum",
        category: "Full Hair",
        price: 699,
        description:
          "A rich, deep purple shade that can have either reddish or bluish undertones for a bold and dramatic look.",
        image: require("../assets/Hair Color/Plum.webp"),
      },
      {
        id: 6,
        name: "Light Golden Brown",
        category: "Full Hair",
        price: 699,
        description:
          "A warm, light brown shade infused with subtle golden tones for a soft and luminous finish.",
        image: require("../assets/Hair Color/Light Golden Brown.webp"),
      },
      {
        id: 7,
        name: "Ember",
        category: "Full Hair",
        price: 699,
        description:
          "A fiery, reddish-orange color with warm undertones, giving your hair a vibrant, glowing effect.",
        image: require("../assets/Hair Color/Ember.webp"),
      },
      // HIGHLIGHT CATEGORY
      {
        id: 1,
        name: "Money Piece",
        category: "Highlight",
        price: 499,
        description:
          "Face-framing highlights that brighten and enhance your look.",
        image: require("../assets/Hair Color/Money Piece.webp"),
      },
      {
        id: 2,
        name: "Copper",
        category: "Highlight",
        price: 499,
        description: "Vibrant copper streaks that add warmth and dimension.",
        image: require("../assets/Hair Color/Copper.webp"),
      },
      {
        id: 3,
        name: "Blue",
        category: "Highlight",
        price: 499,
        description:
          "Bold and vibrant blue for a standout, creative statement.",
        image: require("../assets/Hair Color/Blue.webp"),
      },
      {
        id: 4,
        name: "Cherry Red",
        category: "Highlight",
        price: 499,
        description:
          "Bright, eye-catching red with a playful and daring appeal.",
        image: require("../assets/Hair Color/Cherry Red.webp"),
      },
      {
        id: 5,
        name: "Honey Blonde",
        category: "Highlight",
        price: 499,
        description:
          "This highlight provides a warm, golden blonde color that brightens up the hair.",
        image: require("../assets/Hair Color/Honey Blonde.webp"),
      },
      {
        id: 6,
        name: "Ombre",
        category: "Highlight",
        price: 499,
        description: " A gradual transition from dark roots to lighter ends.",
        image: require("../assets/Hair Color/Ombre.webp"),
      },
      {
        id: 7,
        name: "Caramel",
        category: "Highlight",
        price: 499,
        description: "Warm brown with golden undertones.",
        image: require("../assets/Hair Color/Caramel Highlight.webp"),
      },
      {
        id: 8,
        name: "Chunky",
        category: "Highlight",
        price: 499,
        description: "Thick and distinct strands of color.",
        image: require("../assets/Hair Color/Chunky.webp"),
      },

      // BALAYAGE CATEGORY
      {
        id: 1,
        name: "Ash Blonde",
        category: "Balayage",
        price: 1499,
        description:
          "A cool, muted blonde shade for a sophisticated and modern vibe.",
        image: require("../assets/Hair Color/Ash Blonde.webp"),
      },
      {
        id: 2,
        name: "Burgundy",
        category: "Balayage",
        price: 1499,
        description: "A deep red wine shade for a rich, elegant finish.",
        image: require("../assets/Hair Color/Burgundy Hair.webp"),
      },
      {
        id: 3,
        name: "Auburn",
        category: "Balayage",
        price: 1499,
        description:
          "It provides a warm, vibrant hue that makes your hair stand out, especially when it catches the light.",
        image: require("../assets/Hair Color/Auburn.webp"),
      },
      {
        id: 4,
        name: "Bronde",
        category: "Balayage",
        price: 1499,
        description:
          "This is the perfect blend of blonde and brown tones, creating a sun-kissed and natural look. ",
        image: require("../assets/Hair Color/Bronde.webp"),
      },
      {
        id: 5,
        name: "Chocolate Brown",
        category: "Balayage",
        price: 1499,
        description:
          "It gives your hair a deep and sophisticated look with beautiful, natural-looking dimension.",
        image: require("../assets/Hair Color/Chocolate Brown.webp"),
      },
      {
        id: 6,
        name: "Silver",
        category: "Balayage",
        price: 1499,
        description:
          "For a bold, modern, and edgy look, This is a great choice if you want to make a statement with your hair",
        image: require("../assets/Hair Color/Silver.webp"),
      },
      {
        id: 7,
        name: "Caramel",
        category: "Balayage",
        price: 1499,
        description:
          "This hair color uses rich, warm golden brown and buttery tones that look like a delicious drizzle of caramel. ",
        image: require("../assets/Hair Color/Caramel.webp"),
      },
    ],
  },

  // HAIR TREATMENT SERVICES
  {
    id: 3,
    name: "Hair Treatment",
    styles: [
      {
        id: 1,
        name: "Bleaching",
        price: 200,
        description: "Lightens hair to prepare for vibrant or pastel colors.",
        image: require("../assets/Hair Treatment/Bleaching.webp"),
      },
      {
        id: 2,
        name: "Brazillian",
        price: 700,
        description: "A smoothing treatment that tames frizz and adds shine.",
        image: require("../assets/Hair Treatment/Brazillian.webp"),
      },
      {
        id: 3,
        name: "Cellophane",
        price: 500,
        description:
          "A semi-permanent gloss that boosts shine and color vibrancy.",
        image: require("../assets/Hair Treatment/Cellophane.webp"),
      },
      {
        id: 4,
        name: "Conditioning",
        price: 150,
        description: "Deep conditioning to restore softness and hydration.",
        image: require("../assets/Hair Treatment/Conditioning.webp"),
      },
      {
        id: 5,
        name: "Cystiene",
        price: 1500,
        description:
          "A formaldehyde-free straightening treatment for smooth, silky hair.",
        image: require("../assets/Hair Treatment/Cystiene.webp"),
      },
      {
        id: 6,
        name: "Hair Botox",
        price: 1000,
        description:
          "Restores damaged hair fibers for a healthier, youthful look.",
        image: require("../assets/Hair Treatment/Hair Botox.webp"),
      },
      {
        id: 7,
        name: "Hair Spa",
        price: 300,
        description:
          "A relaxing treatment that nourishes and revitalizes hair.",
        image: require("../assets/Hair Treatment/Hair Spa.webp"),
      },
      {
        id: 8,
        name: "Keratin",
        price: 500,
        description:
          "Infuses hair with keratin for smoothness and frizz control.",
        image: require("../assets/Hair Treatment/Keratin.webp"),
      },
    ],
  },

  // REBOND AND FORMS SERVICES
  {
    id: 4,
    name: "Rebond & Forms",
    styles: [
      {
        id: 1,
        name: "Rebond with Botox",
        price: 2000,
        description:
          "Straightens hair while restoring strength and smoothness with botox treatment.",
        image: require("../assets/Rebond/Rebond with Botox.webp"),
      },
      {
        id: 2,
        name: "Rebond with Brazillian",
        price: 1500,
        description:
          "Combines rebonding with Brazilian treatment for sleek, frizz-free hair.",
        image: require("../assets/Rebond/Rebond with Brazillian.webp"),
      },
      {
        id: 3,
        name: "Rebond with Cellophane",
        price: 1300,
        description:
          "Smooth, straight hair with an added glossy cellophane finish.",
        image: require("../assets/Rebond/Rebond with Cellophane.webp"),
      },
      {
        id: 4,
        name: "Rebond with Color",
        price: 2500,
        description:
          "Straightens and colors your hair for a vibrant, polished look.",
        image: require("../assets/Rebond/Rebond with Color.webp"),
      },
      {
        id: 5,
        name: "Rebond with Keratin",
        price: 1000,
        description:
          "Straightens hair while infusing keratin for lasting smoothness.",
        image: require("../assets/Rebond/Rebond with Keratin.webp"),
      },
    ],
  },

  // NAIL CARE SERVICES
  {
    id: 5,
    name: "Nail Care",
    styles: [
      {
        id: 1,
        name: "Gel Polish",
        price: 500,
        description: "Long-lasting, glossy nail color that resists chipping.",
        image: require("../assets/Nails/Gel Polish.webp"),
      },
      {
        id: 2,
        name: "Removing Gel",
        price: 150,
        description:
          "Gentle and safe removal of gel polish without damaging nails.",
        image: require("../assets/Nails/Removing Gel.webp"),
      },
      {
        id: 3,
        name: "Soft Gel",
        price: 800,
        description:
          "Flexible and lightweight nail extensions for a natural feel",
        image: require("../assets/Nails/Soft Gel.webp"),
      },
    ],
  },

  // FOOT SPA SERVICES
  {
    id: 6,
    name: "Foot Spa",
    styles: [
      {
        id: 1,
        name: "Foot Spa Package",
        price: 300,
        description:
          "A complete foot spa with manicure and pedicure for full relaxation.",
        images: [
          require("../assets/Foot Spa/Foot Spa.webp"),
          require("../assets/Foot Spa/Manicure.webp"),
          require("../assets/Foot Spa/Pedicure.webp"),
        ],
      },
      {
        id: 2,
        name: "Manicure",
        price: 100,
        description: "Professional nail cleaning and shaping for a neat look.",
        image: require("../assets/Foot Spa/Manicure.webp"),
      },
      {
        id: 3,
        name: "Pedicure",
        price: 100,
        description: "Thorough foot cleaning and nail care for healthy feet.",
        image: require("../assets/Foot Spa/Pedicure.webp"),
      },
    ],
  },
];

// Main export - changed from getServices function to direct array export
export default services;
