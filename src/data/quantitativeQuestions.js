export const quantitativeQuestions = [
  {
    section: 'quantitative',
    question: "A local community center is organizing a charity dinner and expects 450 attendees. The caterer plans to serve small dessert tarts, estimating that each attendee will eat 3 tarts. The tarts are sold in bakery boxes of 40. How many boxes of tarts must the caterer order to ensure there are enough for every attendee?",
    options: ["33", "34", "35", "40"],
    correct_answer: "34",
    explanation: "Total tarts needed = 450 guests * 3 tarts/guest = 1,350 tarts. Boxes needed = 1,350 / 40 = 33.75. Since the caterer cannot order a fraction of a box, they must round up to 34."
  },
  {
    section: 'quantitative',
    question: "At a tech company, 40% of the employees are developers and 60% are in other roles. If 70% of the developers and 50% of the non-developers are certified in a new cloud technology, what percentage of the total company employees are certified in this technology?",
    options: ["58%", "60%", "62%", "64%"],
    correct_answer: "58%",
    explanation: "Let total employees be 100. Developers = 40. Others = 60. Certified developers = 70% of 40 = 28. Certified others = 50% of 60 = 30. Total certified = 28 + 30 = 58."
  },
  {
    section: 'quantitative',
    question: "A real estate developer is renovating 3 apartment buildings. Each building has 12 apartments, and each apartment has a total floor area of 120 square meters. The bathrooms, which account for 1/15th of the total floor area in each apartment, all need new tiling. What is the total area of bathroom floors across all 3 buildings that needs to be retiled?",
    options: ["288 sq m", "240 sq m", "144 sq m", "72 sq m"],
    correct_answer: "288 sq m",
    explanation: "Total apartments = 3 * 12 = 36. Bathroom area per apartment = 120 * (1/15) = 8 sq m. Total bathroom area = 36 * 8 = 288 sq m."
  },
  {
    section: 'quantitative',
    question: "During a student survey on a recent exam's difficulty, 1/5 of the students found the exam \"very difficult,\" while 3/8 found it \"moderate.\" If the rest of the students found the exam \"easy,\" what percentage of the students found the exam \"easy\"?",
    options: ["35%", "40%", "42.5%", "57.5%"],
    correct_answer: "42.5%",
    explanation: "1/5 + 3/8 = 8/40 + 15/40 = 23/40 found it difficult/moderate. The rest found it easy: 1 - 23/40 = 17/40. (17 / 40) * 100% = 42.5%."
  },
  {
    section: 'quantitative',
    question: "A cylindrical water tank has a volume of 4,800 liters. A pump fills the tank at a rate of 15 liters per minute. If the pump runs continuously, how many hours will it take to completely fill the empty tank?",
    options: ["3.5", "4.8", "5.33", "6.4"],
    correct_answer: "5.33",
    explanation: "Total minutes = 4,800 / 15 = 320 minutes. Convert to hours = 320 / 60 = 5.33 hours."
  },
  {
    section: 'quantitative',
    question: "A museum is open 9 hours a day. From Monday to Friday, it receives an average of 40 visitors per hour, 25% of whom are seniors. On weekends, it receives an average of 120 visitors per hour, 15% of whom are seniors. Regular admission is 20 Euros, but seniors pay a discounted rate of 12 Euros. How much revenue does the museum generate in a complete week?",
    options: ["63,200 Euros", "67,840 Euros", "71,520 Euros", "73,008 Euros"],
    correct_answer: "73,008 Euros",
    explanation: "Mon-Fri (45 hours): Total = 1,800. Seniors (25%) = 450. Regular = 1,350. Rev = 450*12 + 1350*20 = 5,400 + 27,000 = 32,400. Weekends (18 hours): Total = 2,160. Seniors (15%) = 324. Regular = 1,836. Rev = 324*12 + 1836*20 = 3,888 + 36,720 = 40,608. Total = 73,008 Euros."
  },
  {
    section: 'quantitative',
    question: "A coffee shop blends two types of coffee beans. Bean A costs $12 per kilogram, and Bean B costs $16 per kilogram. The owner wants to create a 50-kilogram blend that costs exactly $15 per kilogram to maximize their profit margin without raising prices. How many kilograms of Bean A should be used in the blend?",
    options: ["12.5 kg", "15 kg", "20 kg", "25 kg"],
    correct_answer: "12.5 kg",
    explanation: "Let x be Bean A. 12x + 16(50 - x) = 15(50). 12x + 800 - 16x = 750. -4x = -50. x = 12.5 kg."
  },
  {
    section: 'quantitative',
    question: "Sarah invests $4,000 in a savings account that yields a simple annual interest rate of 4.5%. At the same time, she invests $6,000 in a different account with a simple annual interest rate of 3%. After 4 years, what is the total amount of interest Sarah has earned from both accounts combined?",
    options: ["$1,320", "$1,440", "$1,560", "$1,680"],
    correct_answer: "$1,440",
    explanation: "Interest 1 = 4000 * 0.045 * 4 = 720. Interest 2 = 6000 * 0.03 * 4 = 720. Total = 720 + 720 = 1,440."
  },
  {
    section: 'quantitative',
    question: "A rectangular garden is 20 meters long and 15 meters wide. A path of uniform width of 2 meters is built completely around the outside of the garden. What is the area of the path?",
    options: ["140 sq m", "156 sq m", "160 sq m", "176 sq m"],
    correct_answer: "156 sq m",
    explanation: "Garden area = 20 * 15 = 300 sq m. Outer dimensions = 24m by 19m. Total area = 456 sq m. Path area = 456 - 300 = 156 sq m."
  },
  {
    section: 'quantitative',
    question: "In a certain high school, the ratio of boys to girls is 4:5. If 20 more boys enroll at the school and 10 girls leave, the number of boys and girls becomes equal. How many students were originally enrolled in the school?",
    options: ["270", "315", "360", "405"],
    correct_answer: "270",
    explanation: "Let boys = 4x, girls = 5x. 4x + 20 = 5x - 10, so x = 30. Original boys = 120, girls = 150. Total = 270."
  },
  {
    section: 'quantitative',
    question: "A store buys a laptop for $600. It marks up the price by 40% to set the regular selling price. During a holiday sale, the store offers a 20% discount on the regular selling price. What is the final selling price of the laptop during the sale, and what is the store's profit?",
    options: ["Price: $768, Profit: $168", "Price: $672, Profit: $72", "Price: $720, Profit: $120", "Price: $648, Profit: $48"],
    correct_answer: "Price: $672, Profit: $72",
    explanation: "Regular price = 600 * 1.40 = 840. Sale price = 840 * 0.80 = 672. Profit = 672 - 600 = 72."
  },
  {
    section: 'quantitative',
    question: "A team of 6 workers can complete a landscaping project in 15 days. If the project needs to be completed in 9 days due to an upcoming event, how many additional workers working at the same rate must be hired?",
    options: ["4", "6", "8", "10"],
    correct_answer: "4",
    explanation: "Total worker-days = 6 * 15 = 90. Workers needed for 9 days = 90 / 9 = 10. Additional = 10 - 6 = 4."
  },
  {
    section: 'quantitative',
    question: "A box contains 5 red balls, 4 blue balls, and 3 green balls. If two balls are drawn at random without replacement, what is the probability that both balls are blue?",
    options: ["1/11", "1/9", "2/15", "4/33"],
    correct_answer: "1/11",
    explanation: "Total balls = 12. P(1st blue) = 4/12. P(2nd blue) = 3/11. Total prob = (4/12) * (3/11) = 1/11."
  },
  {
    section: 'quantitative',
    question: "The average (arithmetic mean) test score for a class of 25 students is 78. If the scores of 5 students who averaged 90 are removed from the calculation, what is the new average score of the remaining students?",
    options: ["72", "74", "75", "76"],
    correct_answer: "75",
    explanation: "Total score = 25 * 78 = 1950. Score removed = 5 * 90 = 450. New total = 1500. New average = 1500 / 20 = 75."
  },
  {
    section: 'quantitative',
    question: "A factory produces two models of smartphones: Model X and Model Y. The production cost of Model X is $150, and it sells for $250. The production cost of Model Y is $200, and it sells for $320. In one month, the factory sold a total of 1,200 smartphones, making a total profit of $128,000. How many Model Y smartphones were sold?",
    options: ["400", "500", "600", "700"],
    correct_answer: "400",
    explanation: "Profit X = 100, Profit Y = 120. x + y = 1200. 100x + 120y = 128000. 100(1200-y) + 120y = 128000. 120000 + 20y = 128000. 20y = 8000. y = 400."
  },
  {
    section: 'quantitative',
    question: "If 3x - 4y = 10 and 2x + y = 14, what is the value of x - y?",
    options: ["-2", "2", "4", "6"],
    correct_answer: "4",
    explanation: "y = 14 - 2x. Substitute: 3x - 4(14 - 2x) = 10. 3x - 56 + 8x = 10. 11x = 66, so x = 6. y = 14 - 12 = 2. x - y = 6 - 2 = 4."
  },
  {
    section: 'quantitative',
    question: "A car travels from City A to City B at an average speed of 60 km/h and returns from City B to City A along the same route at an average speed of 90 km/h. What is the car's average speed for the entire round trip?",
    options: ["72 km/h", "75 km/h", "78 km/h", "80 km/h"],
    correct_answer: "72 km/h",
    explanation: "Let distance = D. Time out = D/60. Time back = D/90. Total time = D/60 + D/90 = 5D/180 = D/36. Avg speed = 2D / (D/36) = 72 km/h."
  },
  {
    section: 'quantitative',
    question: "A right-angled triangle has a hypotenuse of 13 cm and one leg of 5 cm. What is the area of the triangle?",
    options: ["15 sq cm", "30 sq cm", "32.5 sq cm", "60 sq cm"],
    correct_answer: "30 sq cm",
    explanation: "Leg a = 5, hypotenuse c = 13. b = sqrt(169 - 25) = 12 cm. Area = 0.5 * 5 * 12 = 30 sq cm."
  },
  {
    section: 'quantitative',
    question: "In a group of 120 language students, 75 study Spanish, 60 study French, and 20 study neither language. How many students study both Spanish and French?",
    options: ["25", "30", "35", "40"],
    correct_answer: "35",
    explanation: "Total studying at least one = 120 - 20 = 100. Spanish + French - Both = 100. 75 + 60 - Both = 100. 135 - Both = 100. Both = 35."
  },
  {
    section: 'quantitative',
    question: "The perimeter of a rectangular field is 140 meters. The length of the field is 10 meters more than twice its width. What is the area of the field?",
    options: ["800 sq m", "900 sq m", "1000 sq m", "1200 sq m"],
    correct_answer: "1000 sq m",
    explanation: "Perimeter = 2(L + W) = 140, L + W = 70. L = 2W + 10. 3W + 10 = 70. W = 20. L = 50. Area = 50 * 20 = 1000 sq m."
  },
  {
    section: 'quantitative',
    question: "A store owner buys an item and sets its price so that if he gives a 10% discount, he still makes a 20% profit on his cost. If the item's cost is $150, what is the set selling price before the discount?",
    options: ["$180", "$192", "$200", "$225"],
    correct_answer: "$200",
    explanation: "Target profit = 20% of 150 = $30. Target selling price = $180. 0.9 * Set Price = 180. Set Price = $200."
  },
  {
    section: 'quantitative',
    question: "A circular track has a circumference of 400 meters. Two runners start at the same point and run in opposite directions. Runner A runs at a speed of 6 m/s, and Runner B runs at a speed of 4 m/s. How many seconds will it take for them to meet for the first time?",
    options: ["20", "40", "60", "80"],
    correct_answer: "40",
    explanation: "Relative speed = 6 + 4 = 10 m/s. Time = Distance / Relative Speed = 400 / 10 = 40 seconds."
  }
];
