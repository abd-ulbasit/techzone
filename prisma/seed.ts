import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Seed brands
    const brands = [
      { id: 1, name: "Razer" },
      { id: 2, name: "Logitech" },
      { id: 3, name: "Apple" },
      { id: 4, name: "Samsung" },
      { id: 5, name: "Dell" },
      { id: 6, name: "intel" },
      { id: 8, name: "Asus" },
      { id: 9, name: "Kingston" },
      // Add more brands here
    ];

    await prisma.brand.createMany({ data: brands });

    // Seed categories
    const categories = [
      { id: 1, category_name: "Keyboards", items_in_category: 10 },
      { id: 2, category_name: "Mice", items_in_category: 8 },
      { id: 3, category_name: "Laptops", items_in_category: 15 },
      { id: 4, category_name: "CPUs", items_in_category: 12 },
      { id: 5, category_name: "Monitors", items_in_category: 20 },
      { id: 6, category_name: "Drives", items_in_category: 25 },
      // Add more categories here
    ];

    await prisma.category.createMany({ data: categories });

    // Seed products
    const products = [
      {
        pid: 1,
        ProductName:
          "Logitech K380 Multi-Device Bluetooth Keyboard | Off-White English",
        category_Id: 1,
        quanity_in_inventory: 10,
        Price: 8000,
        p_rating: 4.5,
        meta_description:
          "Enjoy the comfort and convenience of desktop typing on your smartphone, and tablet with this mobile keyboard",
        full_description:
          " Type, record, and stream with modern design tools that elevate your desk setup. Work quietly with a slim, lightweight keyboard and mouse. Boost your video meetings and presentations with the Brio 500 webcam and the lightweight Zone Vibe 100 wireless headphones. It’s everything you need to own your space and take your content to the next level.",
        brand_id: 2,
        image:
          "https://www.czone.com.pk/images/thumbnails-large/8-czone.com.pk-1540-14789-140623094017.jpg",
      },
      {
        pid: 2,
        ProductName:
          "Logitech G512 Carbon RGB Mechanical Gaming Keyboard - English layout GX Brown Tactile: 920-009354",
        category_Id: 1,
        quanity_in_inventory: 10,
        Price: 3000,
        p_rating: 4.2,
        meta_description: "this is a very good keyboard",
        full_description:
          "Type, record, and stream with modern design tools that elevate your desk setup. Work quietly with a slim, lightweight keyboard and mouse. Boost your video meetings and presentations with the Brio 500 webcam and the lightweight Zone Vibe 100 wireless headphones. It’s everything you need to own your space and take your content to the next level.",
        brand_id: 2,
        image:
          "https://www.czone.com.pk/images/products/copy-czone920-008949.jpg-1540-8198-120619082607.jpg",
      },
      {
        pid: 3,
        ProductName:
          "Razer Viper Ultimate with Charging Dock Ambidextrous Gaming Mouse with Razer™ HyperSpeed Wireless - Black - RZ01-03050100",
        category_Id: 2,
        quanity_in_inventory: 12,
        Price: 10000,
        p_rating: 4.8,
        meta_description: "Razer Mouse , What else do you need?",
        full_description:
          "Forget about average and claim the unfair advantage with the Razer Viper Ultimate—a wireless gaming mouse built to win. Designed to be a true extension of a gamer, this deadly predator comes with our most cutting-edge technology and is ready to sink its fangs into the competition.",
        brand_id: 1,
        image:
          "https://www.czone.com.pk/images/thumbnails-large/2-czone.com.pk-1540-10499-250323094110.jpg",
      },
      {
        pid: 4,
        ProductName:
          "Razer Viper V2 Pro - Black - Ultra-lightweight, Ultra-fast Wireless Esports Mouse - RZ01-04390100-R3G1",
        category_Id: 2,
        quanity_in_inventory: 10,
        Price: 12000,
        p_rating: 4.9,
        meta_description: "Razer Mouse , What else do you need?",
        full_description:
          "The Razer Viper V2 Pro is the wireless variant of the Viper V2. It has a very low click latency, a wide CPI range, and a low lift-off distance. It's also very lightweight and has a low-profile design that's well-suited for a fingertip grip. Unfortunately, it's a bit too small for most hand sizes to use with a palm or claw grip, and it doesn't have any side buttons.",
        brand_id: 1,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/6-czone.com.pk-1540-14183-291222070302.jpg",
      },
      {
        pid: 5,
        ProductName:
          "Apple MacBook Air 13.6' M2 8-Core, 10-Core GPU, 16GB, 1TB SSD, Midnight",
        category_Id: 3,
        quanity_in_inventory: 10,
        Price: 300000,
        p_rating: 4.9,
        meta_description:
          "Apple MacBook Air 13.6' M2 8-Core, 10-Core GPU, 16GB, 1TB SSD, Midnight",
        full_description:
          "The Apple M1 chip gives the 13‑inch MacBook Pro speed and power beyond belief. With up to 2.8x CPU performance. Up to 5x the graphics speed. Our most advanced Neural Engine for up to 11x faster machine learning. And up to 20 hours of battery life — the longest of any Mac ever. It’s our most popular pro notebook, taken to a whole new level.",
        brand_id: 3,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/copy-1-czone.com.pk-1540-13594-260822023623.jpg",
      },
      {
        pid: 6,
        ProductName:
          "Apple MacBook Pro 16.2' - Apple M2 Pro Chip 12-Core CPU, 32GB, 1TB SSD, 19-Core GPU, Z175000BP | Space Gray",
        category_Id: 3,
        quanity_in_inventory: 10,
        Price: 400000,
        p_rating: 4.9,
        meta_description:
          "Apple MacBook Pro 16.2' - Apple M2 Pro Chip 12-Core CPU, 32GB, 1TB SSD, 19-Core GPU, Z175000BP | Space Gray",
        full_description:
          "The Apple M1 chip gives the 13‑inch MacBook Pro speed and power beyond belief. With up to 2.8x CPU performance. Up to 5x the graphics speed. Our most advanced Neural Engine for up to 11x faster machine learning. And up to 20 hours of battery life — the longest of any Mac ever. It’s our most popular pro notebook, taken to a whole new level.",
        brand_id: 3,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/copy-1-czone.com.pk-1-1540-14432-280223070320.jpg",
      },
      {
        pid: 7,
        ProductName:
          "Dell Inspiron 5415 Laptop - AMD Ryzen 7 5700U, 8GB, 512GB SSD, 14' FHD, Backlit KB, Windows 11 | Platinum Silver",
        category_Id: 3,
        quanity_in_inventory: 10,
        Price: 200000,
        p_rating: 4.9,
        meta_description:
          "Dell Inspiron 5415 Laptop - AMD Ryzen 7 5700U, 8GB, 512GB SSD, 14' FHD, Backlit KB, Windows 11 | Platinum Silver",
        full_description:
          "Get your work done or stream your shows in high quality anywhere without worrying about packing the charger. This Dell Inspiron laptop has plenty of power and a battery that will last you the whole day.",
        brand_id: 5,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/23-czone.com.pk-1540-14649-050523091650.jpg",
      },
      {
        pid: 8,
        ProductName:
          "Dell Inspiron 15 3520 Laptop - Intel Core i5-1235U 8GB 256GB SSD 15.6' FHD 120Hz | Carbon Black",
        category_Id: 3,
        quanity_in_inventory: 10,
        Price: 150000,
        p_rating: 4.9,
        meta_description:
          "Dell Inspiron 15 3520 Laptop - Intel Core i5-1235U 8GB 256GB SSD 15.6' FHD 120Hz | Carbon Black",
        full_description:
          "Get your work done or stream your shows in high quality anywhere without worrying about packing the charger. This Dell Inspiron laptop has plenty of power and a battery that will last you the whole day.",
        brand_id: 5,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/19-czone.com.pk-1540-14648-050523085907.jpg",
      },
      {
        pid: 9,
        ProductName: "Samsung SSD 980 PCIe 3.0 250GB NVMe M.2 2280 | MZ-V8V250",
        category_Id: 6,
        quanity_in_inventory: 10,
        Price: 15000,
        p_rating: 4.9,
        meta_description:
          "Samsung SSD 980 PCIe 3.0 250GB NVMe M.2 2280 | MZ-V8V250",
        full_description:
          "It's time to maximize your PC's potential with the 980. Whether you need a boost for gaming or a seamless workflow for heavy graphics, the 980 is the smart choice for outstanding SSD performance, and it's all backed by an NVMe™ interface and PCIe®3.0 technology.",
        brand_id: 4,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/2-czone.com.pk-1540-12457-161121104626.jpg",
      },
      {
        pid: 10,
        ProductName:
          "Samsung SSD 980 PCIe Gen3x4 NVMe M.2 1TB 2280 | MZ-V8V1T0BW",
        category_Id: 6,
        quanity_in_inventory: 10,
        Price: 25000,
        p_rating: 4.9,
        meta_description:
          "Samsung SSD 980 PCIe Gen3x4 NVMe M.2 1TB 2280 | MZ-V8V1T0BW",
        full_description:
          "It's time to maximize your PC's potential with the 980. Whether you need a boost for gaming or a seamless workflow for heavy graphics, the 980 is the smart choice for outstanding SSD performance, and it's all backed by an NVMe™ interface and PCIe®3.0 technology.",
        brand_id: 4,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/1-czone.com.pk-1540-11647-050621123502.jpg",
      },
      {
        pid: 11,
        ProductName:
          "Kingston DataTraveler Exodia Onyx 128GB USB 3.2 Flash Drive | DTXON/128GB",
        category_Id: 6,
        quanity_in_inventory: 10,
        Price: 2500,
        p_rating: 4.9,
        meta_description:
          "Kingston DataTraveler Exodia Onyx 128GB USB 3.2 Flash Drive | DTXON/128GB",
        full_description:
          "Kingston’s DataTraveler Exodia features USB 3.2 Gen 1 performance for easy access to laptops, desktop PCs, monitors and other digital devices. DT Exodia allows quick transfers and convenient storage of documents, music, videos and more. Its practical design and fashionable colors make it ideal for everyday use at work, home, school or wherever you need to take your data. DT Exodia is available in capacities up to 256GB and is backed by a five-year warranty, free technical support and legendary Kingston reliability.",
        brand_id: 9,
        image:
          "https://www.czone.com.pk/images/thumbnails-large/7-czone.com.pk-1540-14516-220323065013.jpg",
      },
      {
        pid: 12,
        ProductName:
          "Intel Core i3-12100 Processor LGA1700 12th Gen 4 Cores 8 Threads | Tray Pack",
        category_Id: 4,
        quanity_in_inventory: 10,
        Price: 25000,
        p_rating: 4.9,
        meta_description:
          "Intel Core i3-12100 Processor LGA1700 12th Gen 4 Cores 8 Threads | Tray Pack",
        full_description:
          "Intel Core i3-12100 Processor LGA1700 12th Gen 4 Cores 8 Threads | Tray Pack",
        brand_id: 6,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/3-czone.com.pk-1540-14524-240323071039.jpg",
      },
      {
        pid: 13,
        ProductName:
          "Intel Core i5-12600K Processor LGA1700 12th Gen 6 Cores 12 Threads | Tray Pack",
        category_Id: 4,
        quanity_in_inventory: 10,
        Price: 25000,
        p_rating: 4.9,
        meta_description:
          "Intel Core i5-12600K Processor LGA1700 12th Gen 6 Cores 12 Threads | Tray Pack",
        full_description:
          "Intel Core i5-12600K Processor LGA1700 12th Gen 6 Cores 12 Threads | Tray Pack",
        brand_id: 6,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/2-czone.com.pk-1540-12733-130122071137.jpg",
      },
      {
        pid: 14,
        ProductName:
          "Asus ProArt Display PA348CGV 34' Professional Monitor IPS QHD 120Hz VESA Display HDR 400 sRGB 1",
        category_Id: 5,
        quanity_in_inventory: 10,
        Price: 25000,
        p_rating: 4.9,
        meta_description:
          "Asus ProArt Display PA348CGV 34' Professional Monitor IPS QHD 120Hz VESA Display HDR 400 sRGB 1",
        full_description:
          "Asus ProArt Display PA348CGV 34' Professional Monitor IPS QHD 120Hz VESA Display HDR 400 sRGB 1",
        brand_id: 8,
        image:
          "https://www.czone.com.pk/images/thumbnails-large/11-czone.com.pk-1540-14604-200423044146.jpg",
      },
      {
        pid: 15,
        ProductName:
          'ASUS ProArt Display PA279CV Professional Monitor - 27" IPS 4K UHD - 100% sRGB - USB-C',
        category_Id: 5,
        quanity_in_inventory: 10,
        Price: 45000,
        p_rating: 4.9,
        meta_description:
          'ASUS ProArt Display PA279CV Professional Monitor - 27" IPS 4K UHD - 100% sRGB - USB-C',
        full_description:
          'ASUS ProArt Display PA279CV Professional Monitor - 27" IPS 4K UHD - 100% sRGB - USB-C',
        brand_id: 8,
        image:
          "https://www.czone.com.pk/Images/Thumbnails/12-czone.com.pk-1540-13578-240822065923.jpg",
      },
      // Add more products here
    ];

    await prisma.product.createMany({ data: products });

    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
