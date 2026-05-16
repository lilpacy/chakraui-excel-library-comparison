CREATE TABLE `sales_orders` (
	`order_id` text PRIMARY KEY NOT NULL,
	`order_date` text NOT NULL,
	`customer` text NOT NULL,
	`region` text NOT NULL,
	`rep` text NOT NULL,
	`category` text NOT NULL,
	`product` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `sales_orders` (
	`order_id`,
	`order_date`,
	`customer`,
	`region`,
	`rep`,
	`category`,
	`product`,
	`quantity`,
	`unit_price`,
	`status`
) VALUES
	('SO-240501', '2026-05-01', 'Aoyama Coffee Roasters', 'Tokyo', 'Mika Sato', 'Beverages', 'Cold Brew Bottles', 120, 480, 'Delivered'),
	('SO-240502', '2026-05-02', 'Kobe Harbor Bakery', 'Hyogo', 'Riku Tanaka', 'Packaging', 'Takeout Paper Cups', 300, 92, 'In Transit'),
	('SO-240503', '2026-05-03', 'Sapporo Green Hotel', 'Hokkaido', 'Aya Fujimoto', 'Cleaning', 'Eco Laundry Sheets', 180, 210, 'Delivered'),
	('SO-240504', '2026-05-04', 'Nagoya Bento Works', 'Aichi', 'Daichi Mori', 'Ingredients', 'Premium Rice 10kg', 64, 3580, 'Pending'),
	('SO-240505', '2026-05-05', 'Fukuoka Fitness Club', 'Fukuoka', 'Yuna Kato', 'Snacks', 'Protein Bars', 240, 165, 'Delivered'),
	('SO-240506', '2026-05-06', 'Kyoto Stay Hostel', 'Kyoto', 'Mika Sato', 'Amenities', 'Travel Toiletry Sets', 150, 320, 'In Transit'),
	('SO-240507', '2026-05-07', 'Sendai Office Lounge', 'Miyagi', 'Riku Tanaka', 'Stationery', 'A4 Copy Paper Cases', 42, 2850, 'Delivered'),
	('SO-240508', '2026-05-08', 'Naha Seaside Cafe', 'Okinawa', 'Aya Fujimoto', 'Desserts', 'Mango Syrup', 96, 540, 'Pending'),
	('SO-240509', '2026-05-09', 'Yokohama Event Crew', 'Kanagawa', 'Daichi Mori', 'Supplies', 'Disposable Gloves', 500, 28, 'Delivered'),
	('SO-240510', '2026-05-10', 'Osaka Craft Burger', 'Osaka', 'Yuna Kato', 'Ingredients', 'Smoked Cheddar Slices', 210, 138, 'In Transit');
