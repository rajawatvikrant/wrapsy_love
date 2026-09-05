
INSERT INTO public.categories (slug,name,description,image_url,sort_order) VALUES
('birthday-gifts','Birthday Gifts','Make their day unforgettable','/images/hamper-birthday.jpg',1),
('anniversary-gifts','Anniversary Gifts','Celebrate love, beautifully','/images/hamper-anniversary.jpg',2),
('wedding-gifts','Wedding Gifts','Elegant hampers for the big day','/images/hamper-wedding.jpg',3),
('corporate-gifts','Corporate Gifts','Impress clients and teams','/images/hamper-corporate.jpg',4),
('festival-gifts','Festival Gifts','Diwali, Rakhi, Holi & more','/images/hamper-festival.jpg',5),
('chocolate-hampers','Chocolate Hampers','Handcrafted indulgence','/images/hamper-chocolate.jpg',6),
('self-care-hampers','Self-Care Hampers','Calm, wrapped in a box','/images/hamper-selfcare.jpg',7),
('premium-hampers','Premium Hampers','Our most luxurious edits','/images/hero-hamper.jpg',8),
('budget-hampers','Budget Hampers','Thoughtful under ₹999','/images/hamper-chocolate.jpg',9),
('personalized-gifts','Personalized Gifts','Add a name, a note, a memory','/images/hamper-wedding.jpg',10);

INSERT INTO public.products (slug,sku,name,short_description,description,category_id,price,compare_at_price,images,occasions,tags,contents,stock,rating,review_count,is_featured,is_bestseller,is_new,is_customizable)
SELECT v.slug,v.sku,v.name,v.short_description,v.description,c.id,v.price,v.compare_at_price,ARRAY[v.image],v.occasions,v.tags,v.contents,v.stock,v.rating,v.reviews,v.featured,v.bestseller,v.isnew,v.custom
FROM (VALUES
('classic-truffle-box','GH-CHO-001','Classic Truffle Box','12 handcrafted Belgian truffles in a signature box','A dozen slow-set Belgian truffles, hand-finished in our Mumbai atelier and packed in a magnetic keepsake box with a hand-tied ribbon.','chocolate-hampers',799::numeric,999::numeric,'/images/hamper-chocolate.jpg',ARRAY['birthday','thank-you'],ARRAY['chocolate','bestseller'],ARRAY['12 Belgian truffles','Keepsake box','Greeting card'],48,4.8,126,true,true,false,true),
('midnight-cocoa-hamper','GH-CHO-002','Midnight Cocoa Hamper','Dark chocolate, cocoa dusting & coffee','For the dark-chocolate purist: 70% single-origin bars, cocoa-dusted almonds and a small-batch coffee blend.','chocolate-hampers',1299,1599,'/images/hamper-chocolate.jpg',ARRAY['birthday','corporate'],ARRAY['chocolate','coffee'],ARRAY['2 dark bars','Cocoa almonds','Coffee blend 100g'],32,4.7,88,false,true,false,true),
('choco-lovers-grand','GH-CHO-003','Choco Lovers Grand','A full basket of chocolate favourites','Everything chocolate, in one generous basket — truffles, bars, dragees and a cocoa-scented candle.','chocolate-hampers',2499,2999,'/images/hamper-chocolate.jpg',ARRAY['anniversary','birthday'],ARRAY['chocolate','premium'],ARRAY['Truffles','3 bars','Dragees','Cocoa candle'],18,4.9,64,true,false,false,true),
('little-sweet-note','GH-BUD-001','Little Sweet Note','A small hamper with a big heart','Our most-gifted under-₹500 box: two chocolate bars, a scented tea light and a handwritten note card.','budget-hampers',499,649,'/images/hamper-chocolate.jpg',ARRAY['thank-you','birthday'],ARRAY['budget'],ARRAY['2 chocolate bars','Tea light','Note card'],120,4.5,210,false,true,false,true),
('thank-you-treat-box','GH-BUD-002','Thank You Treat Box','Say it simply, say it sweetly','A compact thank-you box with cookies, toffees and a personalised card.','budget-hampers',649,799,'/images/hamper-chocolate.jpg',ARRAY['thank-you','corporate'],ARRAY['budget'],ARRAY['Butter cookies','Toffees','Personalised card'],90,4.4,71,false,false,false,true),
('everyday-joy-basket','GH-BUD-003','Everyday Joy Basket','Snacks, tea and a small candle','A cheerful pick-me-up basket for no reason at all.','budget-hampers',899,1099,'/images/hamper-selfcare.jpg',ARRAY['thank-you'],ARRAY['budget','self-care'],ARRAY['Assorted snacks','Tea sachets','Soy candle'],75,4.3,44,false,false,true,true),
('birthday-surprise-box','GH-BIR-001','Birthday Surprise Box','Balloons, cupcake candle & chocolates','Arrives ready to celebrate — foil balloons, a cupcake candle, chocolates and a birthday card.','birthday-gifts',1199,1499,'/images/hamper-birthday.jpg',ARRAY['birthday'],ARRAY['bestseller'],ARRAY['Foil balloons','Cupcake candle','Chocolates','Birthday card'],54,4.8,163,true,true,false,true),
('birthday-teddy-hamper','GH-BIR-002','Birthday Teddy Hamper','Plush teddy with sweets','A soft 12-inch teddy tucked in with chocolates and a personalised tag.','birthday-gifts',1599,1899,'/images/hamper-birthday.jpg',ARRAY['birthday'],ARRAY['kids'],ARRAY['12in teddy','Chocolates','Personalised tag'],40,4.6,97,false,true,false,true),
('milestone-birthday-luxe','GH-BIR-003','Milestone Birthday Luxe','For the big ones — 30, 40, 50','A grown-up celebration hamper: artisanal chocolates, candle, dry fruits and a keepsake card.','birthday-gifts',3499,3999,'/images/hero-hamper.jpg',ARRAY['birthday'],ARRAY['premium'],ARRAY['Artisan chocolates','Luxury candle','Dry fruits','Keepsake card'],14,4.9,38,true,false,false,true),
('confetti-cake-hamper','GH-BIR-004','Confetti & Cake Hamper','Cake jar, sprinkles & fizz','A dessert-first birthday hamper with a cake jar, sprinkles and sparkling juice.','birthday-gifts',1399,1699,'/images/hamper-birthday.jpg',ARRAY['birthday'],ARRAY['dessert'],ARRAY['Cake jar','Sprinkle mix','Sparkling juice'],36,4.5,52,false,false,true,true),
('forever-roses-hamper','GH-ANN-001','Forever Roses Hamper','Red roses, wine glasses & chocolates','A romantic evening in a basket — preserved roses, two crystal glasses and dark chocolates.','anniversary-gifts',2999,3499,'/images/hamper-anniversary.jpg',ARRAY['anniversary'],ARRAY['romance','bestseller'],ARRAY['Preserved roses','2 glasses','Dark chocolates','Candle'],22,4.9,84,true,true,false,true),
('date-night-in','GH-ANN-002','Date Night In','Candlelight, cocoa & music','Everything for a night in: soy candle, hot cocoa for two and a curated playlist card.','anniversary-gifts',1799,2099,'/images/hamper-anniversary.jpg',ARRAY['anniversary'],ARRAY['romance'],ARRAY['Soy candle','Cocoa for two','Playlist card'],44,4.6,59,false,false,false,true),
('silver-jubilee-hamper','GH-ANN-003','Silver Jubilee Hamper','25 years, celebrated in silver','A premium anniversary hamper with silver-finish accents, dry fruits and engraved keepsake.','anniversary-gifts',4999,5799,'/images/hamper-wedding.jpg',ARRAY['anniversary','wedding'],ARRAY['premium','personalized'],ARRAY['Silver keepsake','Dry fruit jars','Chocolates','Engraved card'],10,5.0,21,true,false,false,true),
('shubh-vivah-hamper','GH-WED-001','Shubh Vivah Hamper','Ivory & gold wedding hamper','An heirloom-worthy wedding hamper with dry fruit jars, mithai and jasmine-scented packaging.','wedding-gifts',3999,4599,'/images/hamper-wedding.jpg',ARRAY['wedding'],ARRAY['premium'],ARRAY['4 dry fruit jars','Mithai box','Scented sachet'],20,4.8,47,true,true,false,true),
('bridal-glow-hamper','GH-WED-002','Bridal Glow Hamper','Pre-wedding self-care edit','Skincare, bath salts and a silk eye mask for the week before the wedding.','wedding-gifts',2799,3299,'/images/hamper-selfcare.jpg',ARRAY['wedding'],ARRAY['self-care'],ARRAY['Face oil','Bath salts','Silk eye mask','Candle'],26,4.7,33,false,false,true,true),
('reception-thank-you-box','GH-WED-003','Reception Thank-You Box','Elegant favours for guests','Minimum order of 10 — ivory favour boxes with almonds, chocolate and a printed tag.','wedding-gifts',349,449,'/images/hamper-wedding.jpg',ARRAY['wedding','thank-you'],ARRAY['bulk','budget'],ARRAY['Almonds','Chocolate','Printed tag'],500,4.4,112,false,true,false,true),
('executive-welcome-kit','GH-COR-001','Executive Welcome Kit','Onboarding done beautifully','A matte-black welcome kit with notebook, pen, steel tumbler and speciality coffee.','corporate-gifts',2199,2599,'/images/hamper-corporate.jpg',ARRAY['corporate'],ARRAY['corporate','bestseller'],ARRAY['Notebook','Pen','Steel tumbler','Coffee 250g'],60,4.7,76,true,true,false,true),
('client-appreciation-hamper','GH-COR-002','Client Appreciation Hamper','Gourmet snacks & coffee','A refined thank-you for clients — gourmet snacks, coffee and a branded note card.','corporate-gifts',1699,1999,'/images/hamper-corporate.jpg',ARRAY['corporate','thank-you'],ARRAY['corporate'],ARRAY['Gourmet snacks','Coffee','Branded card'],80,4.5,64,false,false,false,true),
('team-celebration-crate','GH-COR-003','Team Celebration Crate','Share-size crate for the team','A large crate to celebrate a launch or a quarter — snacks, chocolates and mugs for six.','corporate-gifts',4499,5199,'/images/hamper-corporate.jpg',ARRAY['corporate'],ARRAY['corporate','bulk'],ARRAY['6 mugs','Snack assortment','Chocolates'],16,4.6,29,false,false,true,true),
('diwali-prosperity-hamper','GH-FES-001','Diwali Prosperity Hamper','Diyas, dry fruits & mithai','Our signature Diwali hamper: brass diyas, premium dry fruits, kaju katli and marigold accents.','festival-gifts',2299,2799,'/images/hamper-festival.jpg',ARRAY['festival'],ARRAY['diwali','bestseller'],ARRAY['2 brass diyas','Dry fruits 500g','Kaju katli','Card'],70,4.8,188,true,true,false,true),
('festive-mithai-box','GH-FES-002','Festive Mithai Box','Assorted Indian sweets','Freshly-made assorted mithai in a festive presentation box.','festival-gifts',1099,1299,'/images/hamper-festival.jpg',ARRAY['festival'],ARRAY['diwali','sweets'],ARRAY['500g assorted mithai','Festive box'],110,4.5,143,false,true,false,false),
('rakhi-blessings-hamper','GH-FES-003','Rakhi Blessings Hamper','Rakhi, roli chawal & sweets','A complete Raksha Bandhan hamper with handcrafted rakhi, roli-chawal and chocolates.','festival-gifts',899,1099,'/images/hamper-festival.jpg',ARRAY['festival'],ARRAY['rakhi'],ARRAY['Handcrafted rakhi','Roli chawal','Chocolates'],95,4.4,101,false,false,true,true),
('holi-colours-hamper','GH-FES-004','Holi Colours Hamper','Organic gulal, gujiya & thandai','Play safe and sweet — organic gulal, gujiya and instant thandai mix.','festival-gifts',1199,1399,'/images/hamper-festival.jpg',ARRAY['festival'],ARRAY['holi'],ARRAY['Organic gulal','Gujiya','Thandai mix'],65,4.3,37,false,false,true,false),
('unwind-spa-hamper','GH-SEL-001','Unwind Spa Hamper','Candle, salts & body oils','A quiet evening in a tray — soy candle, epsom bath salts, body oil and a loofah.','self-care-hampers',1899,2199,'/images/hamper-selfcare.jpg',ARRAY['birthday','thank-you'],ARRAY['self-care','bestseller'],ARRAY['Soy candle','Bath salts','Body oil','Loofah'],52,4.7,119,true,true,false,true),
('slow-morning-hamper','GH-SEL-002','Slow Morning Hamper','Tea, honey & ceramic mug','Loose-leaf tea, raw honey and a hand-thrown ceramic mug for unhurried mornings.','self-care-hampers',1499,1799,'/images/hamper-selfcare.jpg',ARRAY['thank-you'],ARRAY['self-care','tea'],ARRAY['Loose-leaf tea','Raw honey','Ceramic mug'],58,4.6,73,false,false,false,true),
('glow-skincare-hamper','GH-SEL-003','Glow Skincare Hamper','Clean beauty essentials','A curated clean-beauty set — face oil, clay mask, lip balm and a linen pouch.','self-care-hampers',2399,2799,'/images/hamper-selfcare.jpg',ARRAY['birthday','anniversary'],ARRAY['self-care'],ARRAY['Face oil','Clay mask','Lip balm','Linen pouch'],30,4.8,55,false,false,true,true),
('the-luxe-signature','GH-PRE-001','The Luxe Signature','Our flagship premium hamper','The full Luxe basket: artisan chocolates, mixed nuts, dried fruit, scented candle and dried florals in a hand-woven basket.','premium-hampers',5999,6999,'/images/hero-hamper.jpg',ARRAY['wedding','corporate','anniversary'],ARRAY['premium','bestseller'],ARRAY['Artisan chocolates','Mixed nuts','Dried fruits','Scented candle','Woven basket'],12,4.9,92,true,true,false,true),
('gold-edition-hamper','GH-PRE-002','Gold Edition Hamper','Gold-foiled luxury edit','Gold-foiled packaging with premium chocolates, saffron and a luxury candle.','premium-hampers',7999,8999,'/images/hero-hamper.jpg',ARRAY['wedding','corporate'],ARRAY['premium'],ARRAY['Premium chocolates','Saffron 1g','Luxury candle','Gold packaging'],8,5.0,26,true,false,false,true),
('connoisseur-dry-fruit-chest','GH-PRE-003','Connoisseur Dry Fruit Chest','Five-jar wooden chest','A wooden chest with five glass jars of premium almonds, cashews, pistachios, figs and apricots.','premium-hampers',4599,5299,'/images/hamper-wedding.jpg',ARRAY['festival','wedding','corporate'],ARRAY['premium','dry-fruits'],ARRAY['Almonds','Cashews','Pistachios','Figs','Apricots'],24,4.8,68,false,true,false,true),
('name-engraved-gift-box','GH-PER-001','Name Engraved Gift Box','Wooden box with engraved name','A solid wood box engraved with a name or date, filled with chocolates and a photo frame.','personalized-gifts',2199,2599,'/images/hamper-wedding.jpg',ARRAY['birthday','anniversary'],ARRAY['personalized','bestseller'],ARRAY['Engraved wooden box','Chocolates','Photo frame'],34,4.8,81,true,true,false,true),
('photo-memory-hamper','GH-PER-002','Photo Memory Hamper','Printed photos, frame & candle','Send us up to six photos — we print, frame and pack them with a candle and chocolates.','personalized-gifts',1899,2299,'/images/hamper-birthday.jpg',ARRAY['birthday','anniversary'],ARRAY['personalized'],ARRAY['6 printed photos','Wooden frame','Candle','Chocolates'],42,4.6,49,false,false,true,true),
('letter-to-you-box','GH-PER-003','Letter To You Box','Handwritten letter & keepsakes','A calligrapher writes your message on handmade paper, packed with dried flowers and sweets.','personalized-gifts',1299,1549,'/images/hamper-anniversary.jpg',ARRAY['anniversary','thank-you'],ARRAY['personalized'],ARRAY['Handwritten letter','Dried flowers','Sweets'],66,4.7,58,false,false,false,true)
) AS v(slug,sku,name,short_description,description,cat,price,compare_at_price,image,occasions,tags,contents,stock,rating,reviews,featured,bestseller,isnew,custom)
JOIN public.categories c ON c.slug = v.cat;

INSERT INTO public.hamper_components (name,kind,price,image_url,sort_order) VALUES
('Small Woven Basket','base',199,'/images/hero-hamper.jpg',1),
('Medium Woven Basket','base',299,'/images/hero-hamper.jpg',2),
('Large Woven Basket','base',449,'/images/hero-hamper.jpg',3),
('Matte Black Gift Box','base',349,'/images/hamper-corporate.jpg',4),
('Belgian Truffles (6 pc)','item',349,'/images/hamper-chocolate.jpg',10),
('Dark Chocolate Bar','item',199,'/images/hamper-chocolate.jpg',11),
('Assorted Dry Fruits 250g','item',449,'/images/hamper-wedding.jpg',12),
('Roasted Almonds 200g','item',329,'/images/hamper-wedding.jpg',13),
('Soy Scented Candle','item',399,'/images/hamper-selfcare.jpg',14),
('Bath Salts Jar','item',299,'/images/hamper-selfcare.jpg',15),
('Body Oil 100ml','item',449,'/images/hamper-selfcare.jpg',16),
('Speciality Coffee 100g','item',379,'/images/hamper-corporate.jpg',17),
('Loose Leaf Tea Tin','item',329,'/images/hamper-selfcare.jpg',18),
('Mini Teddy Bear','item',299,'/images/hamper-birthday.jpg',19),
('Indoor Plant','item',399,'/images/hamper-selfcare.jpg',20),
('Ceramic Mug','item',349,'/images/hamper-corporate.jpg',21),
('Kaju Katli Box 250g','item',499,'/images/hamper-festival.jpg',22),
('Brass Diya Pair','item',249,'/images/hamper-festival.jpg',23),
('Greeting Card','personalization',49,NULL,30),
('Handwritten Message Card','personalization',99,NULL,31),
('Premium Gift Wrapping','personalization',149,NULL,32),
('Satin Ribbon & Tag','personalization',79,NULL,33),
('Engraved Name Tag','personalization',199,NULL,34);

INSERT INTO public.coupons (code,discount_type,discount_value,min_order,max_discount,usage_limit,ends_at) VALUES
('WELCOME10','percent',10,999,500,1000,now() + interval '180 days'),
('FESTIVE15','percent',15,1999,1000,500,now() + interval '90 days'),
('FLAT200','flat',200,1499,NULL,NULL,now() + interval '365 days'),
('CORPORATE20','percent',20,9999,5000,100,now() + interval '365 days'),
('FREESHIP','flat',99,499,99,NULL,now() + interval '365 days');
