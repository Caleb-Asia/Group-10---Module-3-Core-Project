export const PRODUCT_DETAILS = {
  1:{protein:'18g',carbs:'52g',fat:'12g',fibre:'10g',calories:'420kcal',allergens:'Contains: Gluten, Dairy. Nut-Free.',ingredients:['Herb chicken wrap','Cherry tomatoes','Baby spinach','Wholegrain tortilla'],satiety:4},
  2:{protein:'22g',carbs:'62g',fat:'14g',fibre:'14g',calories:'490kcal',allergens:'Contains: Gluten, Soy. Nut-Free.',ingredients:['Grilled chicken breast','Steamed broccoli & carrots','Fluffy white rice','Herb butter sauce'],satiety:4},
  3:{protein:'34g',carbs:'58g',fat:'18g',fibre:'12g',calories:'560kcal',allergens:'Contains: Dairy. Nut-Free.',ingredients:['Sirloin steak strips','Sweet potato mash','Green beans','Peppercorn sauce'],satiety:5},
  4:{protein:'19g',carbs:'64g',fat:'13g',fibre:'15g',calories:'470kcal',allergens:'Contains: Soy. Nut-Free. Vegan.',ingredients:['Chickpea & lentil curry','Brown basmati rice','Roasted cauliflower','Coconut yogurt'],satiety:4},
  5:{protein:'28g',carbs:'18g',fat:'24g',fibre:'8g',calories:'410kcal',allergens:'Contains: Dairy, Eggs. Nut-Free. Keto.',ingredients:['Grilled chicken thigh','Avocado','Zucchini noodles','Pesto (no nuts)'],satiety:5},
  6:{protein:'21g',carbs:'58g',fat:'13g',fibre:'12g',calories:'450kcal',allergens:'Nut-Free certified. Contains: Gluten, Dairy.',ingredients:['Turkey meatballs','Wholewheat pasta','Marinara sauce','Steamed greens'],satiety:4},
  7:{protein:'6g',carbs:'22g',fat:'8g',fibre:'3g',calories:'180kcal',allergens:'Nut-Free certified.',ingredients:['Mixed snack pack — see individual items'],satiety:3},
  8:{protein:'24g',carbs:'66g',fat:'16g',fibre:'10g',calories:'520kcal',allergens:'Contains: Gluten, Dairy.',ingredients:['Energy oats bar','Banana bread slice','Trail mix (nut-free)','Dark chocolate square'],satiety:5},
  9:{protein:'25g',carbs:'48g',fat:'12g',fibre:'8g',calories:'400kcal',allergens:'Contains: Gluten. Nut-Free.',ingredients:['Custom builder meal — details vary by selection'],satiety:4},
  10:{protein:'8g',carbs:'26g',fat:'9g',fibre:'4g',calories:'210kcal',allergens:'Nut-Free.',ingredients:['Custom builder snack — details vary by selection'],satiety:3},
  11:{protein:'23g',carbs:'60g',fat:'14g',fibre:'11g',calories:'475kcal',allergens:'Halal-certified. Contains: Gluten.',ingredients:['Halal chicken biryani','Basmati rice','Mixed vegetables','Raita'],satiety:4},
  12:{protein:'20g',carbs:'62g',fat:'13g',fibre:'13g',calories:'460kcal',allergens:'Gluten-Free certified.',ingredients:['Herb chicken','Quinoa tabbouleh','Roasted vegetables','Tahini dressing'],satiety:4},
  13:{protein:'26g',carbs:'55g',fat:'11g',fibre:'9g',calories:'430kcal',allergens:'Contains: Soy. Nut-Free.',ingredients:['Power rice bowl — see item description'],satiety:4},
  14:{protein:'32g',carbs:'24g',fat:'18g',fibre:'7g',calories:'410kcal',allergens:'Nut-Free. Keto-friendly.',ingredients:['Lean steak strips','Sautéed greens','Garlic butter','Roasted cherry tomatoes'],satiety:5},
  15:{protein:'16g',carbs:'58g',fat:'12g',fibre:'14g',calories:'420kcal',allergens:'Vegan. Nut-Free.',ingredients:['Harvest vegetable curry','Brown rice','Roasted sweet potato','Coriander'],satiety:4},
  16:{protein:'28g',carbs:'50g',fat:'13g',fibre:'8g',calories:'440kcal',allergens:'Contains: Gluten. Nut-Free.',ingredients:['Grilled chicken breast','Herbed couscous','Roasted zucchini','Lemon yogurt'],satiety:4},
  17:{protein:'9g',carbs:'14g',fat:'14g',fibre:'4g',calories:'220kcal',allergens:'Contains: Nuts (almonds).',ingredients:['Dark chocolate coated almonds'],satiety:3},
  18:{protein:'4g',carbs:'24g',fat:'5g',fibre:'3g',calories:'160kcal',allergens:'Nut-Free. Vegan.',ingredients:['Apple cinnamon oat bites'],satiety:3},
  19:{protein:'3g',carbs:'22g',fat:'3g',fibre:'2g',calories:'130kcal',allergens:'Contains: Gluten. Nut-Free.',ingredients:['Salted pretzel sticks'],satiety:2},
  20:{protein:'8g',carbs:'18g',fat:'9g',fibre:'4g',calories:'190kcal',allergens:'Nut-Free.',ingredients:['Protein energy balls'],satiety:3},
  21:{protein:'6g',carbs:'20g',fat:'8g',fibre:'4g',calories:'180kcal',allergens:'Nut-Free.',ingredients:['Builder snack mix'],satiety:3}
};

export function getProductDetails(productId) {
  return PRODUCT_DETAILS[Number(productId)] || { protein:'—', carbs:'—', fat:'—', fibre:'—', calories:'—', allergens:'Not available.', ingredients:['Details not available for this product.'], satiety:4 };
}
