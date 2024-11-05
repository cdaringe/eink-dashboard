import React from "react";
import { ok } from "assert";
import Recipes, { RecipeRoot } from "../../../components/Recipes";
import { connection } from "next/server";

const { NYT_API_KEY } = process.env;

type ResponseOk = { status: "OK"; response: { docs: RecipeRoot[] } };

type Response =
| ResponseOk
| { status: "ERROR"; body: unknown };

const getData = () => {
  if (true) {
    ok(NYT_API_KEY, "NYT_API_KEY is not set!");
    const url = new URL(
      "https://api.nytimes.com/svc/search/v2/articlesearch.json",
    );
    url.searchParams.set("fq", 'type_of_material:("Recipe")');
    url.searchParams.set("api-key", NYT_API_KEY!);
    url.searchParams.set("sort", "newest");
    return fetch(url.toString())
    .then((res) => res.json())
    .then((result) => result as ResponseOk, (err) => {
      return { status: "ERROR", body: String(err) } as Response;
    });
  }
  // return fetchData();
};

const RecipePage: React.FC = async ({}) => {
  await connection();
  const res = await getData();
  return res.status === "OK" ? <Recipes recipes={res.response.docs} /> : (
    <div>
      Error getting Recidives! <br />
      <pre>{JSON.stringify(res.body, null, 2)}</pre>
    </div>
  );
};

export default RecipePage;

// const fetchData = async (): Promise<ResponseOk> => ({
//   status: "OK",
//   copyright:
//     "Copyright (c) 2024 The New York Times Company. All Rights Reserved.",
//   response: {
//     docs: [
//       {
//         abstract: "A signature Provençal pizza thick with carmelized onions.",
//         web_url:
//           "https://www.nytimes.com/2009/05/29/health/nutrition/29recipehealth.html",
//         snippet: "A signature Provençal pizza thick with carmelized onions.",
//         lead_paragraph:
//           "Pissaladière is a signature Provençal dish from Nice and environs, a pizza spread with a thick, sweet layer of onions that have been cooked slowly until they caramelize and garnished with olives and anchovies. ",
//         source: "The New York Times",
//         multimedia: [
//           {
//             rank: 0,
//             subtype: "watch308",
//             type: "image",
//             url:
//               "images/2009/05/29/health/29recipehealth_600/29recipehealth_600-watch308-v2.jpg",
//             height: 348,
//             width: 312,
//             subType: "watch308",
//             crop_name: "watch308",
//           },
//         ],
//         headline: {
//           main: "Provençal Onion Pizza",
//           kicker: "Recipes for Health",
//           content_kicker: null,
//           print_headline: "Provençal Onion Pizza",
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Medicine and Health",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Cooking and Cookbooks",
//             rank: 3,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Pizza Pies",
//             rank: 4,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Diet and Nutrition",
//             rank: 5,
//             major: "N",
//           },
//         ],
//         pub_date: "2009-05-25T20:37:40+0000",
//         document_type: "article",
//         news_desk: "Science",
//         section_name: "Health",
//         subsection_name: "Fitness & Nutrition",
//         byline: {
//           original: "By Martha Rose Shulman",
//           person: [
//             {
//               firstname: "Martha",
//               middlename: "Rose",
//               lastname: "Shulman",
//               qualifier: null,
//               title: null,
//               role: "reported",
//               organization: "",
//               rank: 1,
//             },
//           ],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/000b2551-a390-5921-abc4-687ad7042460",
//         word_count: 383,
//         uri: "nyt://article/000b2551-a390-5921-abc4-687ad7042460",
//       },
//       {
//         abstract: "A recipe for Sage Frittata.",
//         web_url: "https://www.nytimes.com/2008/08/06/dining/061mrex.html",
//         snippet: "A recipe for Sage Frittata.",
//         lead_paragraph: "Adapted from La Zucca Magica, Nice",
//         print_section: "F",
//         print_page: "3",
//         source: "The New York Times",
//         multimedia: [],
//         headline: {
//           main: "Sage Frittata",
//           kicker: "Recipe",
//           content_kicker: null,
//           print_headline:
//             "Sage Frittata Adapted from La Zucca Magica, Nice Time: 20 minutes",
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Cooking and Cookbooks",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Eggs",
//             rank: 3,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Cheese",
//             rank: 4,
//             major: "N",
//           },
//         ],
//         pub_date: "2008-08-06T04:00:00+0000",
//         document_type: "article",
//         news_desk: "Dining",
//         section_name: "Food",
//         byline: {
//           original: null,
//           person: [],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/00216d70-8929-5151-aff5-5e5f037d61fe",
//         word_count: 121,
//         uri: "nyt://article/00216d70-8929-5151-aff5-5e5f037d61fe",
//       },
//       {
//         abstract: "About 6 cups lobster stock (recipe here)",
//         web_url:
//           "https://www.nytimes.com/2008/07/06/magazine/06food-t-004.html",
//         snippet: "",
//         lead_paragraph: "About 6 cups lobster stock (recipe here)",
//         print_section: "MM",
//         print_page: "51",
//         source: "The New York Times",
//         multimedia: [
//           {
//             rank: 0,
//             subtype: "popup",
//             type: "image",
//             url: "images/2008/07/06/magazine/06food.1-650.jpg",
//             height: 314,
//             width: 471,
//             subType: "popup",
//             crop_name: "popup",
//           },
//           {
//             rank: 0,
//             subtype: "articleInline",
//             type: "image",
//             url: "images/2008/07/06/magazine/06food.1-190.jpg",
//             height: 118,
//             width: 190,
//             subType: "articleInline",
//             crop_name: "articleInline",
//           },
//         ],
//         headline: {
//           main: "Lobster Risotto",
//           kicker: "Recipe",
//           content_kicker: null,
//           print_headline: "Three Ways Till Sunday",
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Lobsters",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Food",
//             rank: 3,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Cooking and Cookbooks",
//             rank: 4,
//             major: "N",
//           },
//         ],
//         pub_date: "2008-07-06T04:00:00+0000",
//         document_type: "article",
//         news_desk: "Magazine",
//         section_name: "Magazine",
//         byline: {
//           original: null,
//           person: [],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/00319dae-1509-53c8-b2d5-8a1111d22d05",
//         word_count: 213,
//         uri: "nyt://article/00319dae-1509-53c8-b2d5-8a1111d22d05",
//       },
//       {
//         abstract:
//           "A beef-free bounty for your grill, from the familiar (portobellos) to the far-out (watermelon burgers).",
//         web_url:
//           "https://www.nytimes.com/2011/07/10/magazine/teriyaki-cabbage-steaks.html",
//         snippet:
//           "A beef-free bounty for your grill, from the familiar (portobellos) to the far-out (watermelon burgers).",
//         lead_paragraph: "Time: 1 hour",
//         print_section: "MM",
//         print_page: "42",
//         source: "The New York Times",
//         multimedia: [],
//         headline: {
//           main: "Teriyaki Cabbage Steaks",
//           kicker: "Recipes",
//           content_kicker: null,
//           print_headline: "Teriyaki Cabbage Steaks",
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Grilling (Cooking)",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Cabbage",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 3,
//             major: "N",
//           },
//         ],
//         pub_date: "2011-07-06T22:42:43+0000",
//         document_type: "article",
//         news_desk: "Magazine",
//         section_name: "Magazine",
//         byline: {
//           original: "By Mark Bittman",
//           person: [
//             {
//               firstname: "Mark",
//               middlename: null,
//               lastname: "Bittman",
//               qualifier: null,
//               title: null,
//               role: "reported",
//               organization: "",
//               rank: 1,
//             },
//           ],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/003551b6-3ffd-5f8d-8cd7-95f8a8873b84",
//         word_count: 244,
//         uri: "nyt://article/003551b6-3ffd-5f8d-8cd7-95f8a8873b84",
//       },
//       {
//         abstract:
//           "A recipe that combines kosher salt, paprika, black pepper and other ingredients.",
//         web_url:
//           "https://www.nytimes.com/2011/01/23/magazine/23Food-t-002.html",
//         snippet:
//           "A recipe that combines kosher salt, paprika, black pepper and other ingredients.",
//         lead_paragraph: " ¼ cup kosher salt",
//         print_section: "MM",
//         print_page: "29",
//         source: "The New York Times",
//         multimedia: [],
//         headline: {
//           main: "Cajun Seasoning",
//           kicker: "Recipes",
//           content_kicker: null,
//           print_headline: "Cajun Seasoning",
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Pepper (Spice)",
//             rank: 2,
//             major: "N",
//           },
//         ],
//         pub_date: "2011-01-20T00:04:10+0000",
//         document_type: "article",
//         news_desk: "Magazine",
//         section_name: "Magazine",
//         byline: {
//           original: "By Pete Wells",
//           person: [
//             {
//               firstname: "Pete",
//               middlename: null,
//               lastname: "Wells",
//               qualifier: null,
//               title: null,
//               role: "reported",
//               organization: "",
//               rank: 1,
//             },
//           ],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/0051843b-e4ec-55bb-b4e0-dc06e03d4830",
//         word_count: 58,
//         uri: "nyt://article/0051843b-e4ec-55bb-b4e0-dc06e03d4830",
//       },
//       {
//         abstract:
//           "This simple soup is both comforting and light, good at any time of year.",
//         web_url:
//           "https://www.nytimes.com/2008/08/28/health/nutrition/28recipehealth.html",
//         snippet:
//           "This simple soup is both comforting and light, good at any time of year.",
//         lead_paragraph:
//           "In the Middle East, yogurt is used in hot dishes as well as cold. This simple soup is both comforting and light, good at any time of year, but in warm weather serve it warm but not simmering hot. To stabilize the yogurt so that it doesn't curdle when it cooks, stir in a little cornstarch.",
//         source: "The New York Times",
//         multimedia: [
//           {
//             rank: 0,
//             subtype: "watch308",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-watch308-v2.jpg",
//             height: 348,
//             width: 312,
//             subType: "watch308",
//             crop_name: "watch308",
//           },
//           {
//             rank: 0,
//             subtype: "watch268",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-watch268-v2.jpg",
//             height: 303,
//             width: 272,
//             subType: "watch268",
//             crop_name: "watch268",
//           },
//           {
//             rank: 0,
//             subtype: "wide",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-thumbWide.jpg",
//             height: 126,
//             width: 190,
//             legacy: {
//               widewidth: 190,
//               wideheight: 126,
//               wide:
//                 "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-thumbWide.jpg",
//             },
//             subType: "wide",
//             crop_name: "thumbWide",
//           },
//           {
//             rank: 0,
//             subtype: "videoThumb",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoThumb.jpg",
//             height: 50,
//             width: 75,
//             subType: "videoThumb",
//             crop_name: "videoThumb",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo210",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-mediumThreeByTwo210.jpg",
//             height: 140,
//             width: 210,
//             subType: "mediumThreeByTwo210",
//             crop_name: "mediumThreeByTwo210",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo225",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-mediumThreeByTwo225.jpg",
//             height: 150,
//             width: 225,
//             subType: "mediumThreeByTwo225",
//             crop_name: "mediumThreeByTwo225",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo440",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-mediumThreeByTwo440.jpg",
//             height: 293,
//             width: 440,
//             subType: "mediumThreeByTwo440",
//             crop_name: "mediumThreeByTwo440",
//           },
//           {
//             rank: 0,
//             subtype: "facebookJumbo",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-facebookJumbo-v2.jpg",
//             height: 340,
//             width: 650,
//             subType: "facebookJumbo",
//             crop_name: "facebookJumbo",
//           },
//           {
//             rank: 0,
//             subtype: "miniMoth",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-miniMoth.jpg",
//             height: 70,
//             width: 151,
//             subType: "miniMoth",
//             crop_name: "miniMoth",
//           },
//           {
//             rank: 0,
//             subtype: "xlarge",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-articleLarge.jpg",
//             height: 900,
//             width: 600,
//             legacy: {
//               xlarge:
//                 "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-articleLarge.jpg",
//               xlargewidth: 600,
//               xlargeheight: 900,
//             },
//             subType: "xlarge",
//             crop_name: "articleLarge",
//           },
//           {
//             rank: 0,
//             subtype: "blog480",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-blog480.jpg",
//             height: 720,
//             width: 480,
//             subType: "blog480",
//             crop_name: "blog480",
//           },
//           {
//             rank: 0,
//             subtype: "blog427",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-blog427.jpg",
//             height: 641,
//             width: 427,
//             subType: "blog427",
//             crop_name: "blog427",
//           },
//           {
//             rank: 0,
//             subtype: "tmagArticle",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-tmagArticle.jpg",
//             height: 888,
//             width: 592,
//             subType: "tmagArticle",
//             crop_name: "tmagArticle",
//           },
//           {
//             rank: 0,
//             subtype: "jumbo",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-jumbo.jpg",
//             height: 975,
//             width: 650,
//             subType: "jumbo",
//             crop_name: "jumbo",
//           },
//           {
//             rank: 0,
//             subtype: "blog225",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-blog225.jpg",
//             height: 338,
//             width: 225,
//             subType: "blog225",
//             crop_name: "blog225",
//           },
//           {
//             rank: 0,
//             subtype: "master180",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-master180.jpg",
//             height: 270,
//             width: 180,
//             subType: "master180",
//             crop_name: "master180",
//           },
//           {
//             rank: 0,
//             subtype: "popup",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-popup.jpg",
//             height: 500,
//             width: 334,
//             subType: "popup",
//             crop_name: "popup",
//           },
//           {
//             rank: 0,
//             subtype: "blog533",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-blog533.jpg",
//             height: 800,
//             width: 533,
//             subType: "blog533",
//             crop_name: "blog533",
//           },
//           {
//             rank: 0,
//             subtype: "tmagSF",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-tmagSF.jpg",
//             height: 543,
//             width: 362,
//             subType: "tmagSF",
//             crop_name: "tmagSF",
//           },
//           {
//             rank: 0,
//             subtype: "slide",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-slide.jpg",
//             height: 500,
//             width: 334,
//             subType: "slide",
//             crop_name: "slide",
//           },
//           {
//             rank: 0,
//             subtype: "superJumbo",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-superJumbo.jpg",
//             height: 975,
//             width: 650,
//             subType: "superJumbo",
//             crop_name: "superJumbo",
//           },
//           {
//             rank: 0,
//             subtype: "master495",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-master495.jpg",
//             height: 743,
//             width: 495,
//             subType: "master495",
//             crop_name: "master495",
//           },
//           {
//             rank: 0,
//             subtype: "master315",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-master315.jpg",
//             height: 473,
//             width: 315,
//             subType: "master315",
//             crop_name: "master315",
//           },
//           {
//             rank: 0,
//             subtype: "square320",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-square320.jpg",
//             height: 320,
//             width: 320,
//             subType: "square320",
//             crop_name: "square320",
//           },
//           {
//             rank: 0,
//             subtype: "filmstrip",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-filmstrip.jpg",
//             height: 190,
//             width: 190,
//             subType: "filmstrip",
//             crop_name: "filmstrip",
//           },
//           {
//             rank: 0,
//             subtype: "square640",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-square640.jpg",
//             height: 640,
//             width: 640,
//             subType: "square640",
//             crop_name: "square640",
//           },
//           {
//             rank: 0,
//             subtype: "moth",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-moth.jpg",
//             height: 151,
//             width: 151,
//             subType: "moth",
//             crop_name: "moth",
//           },
//           {
//             rank: 0,
//             subtype: "mediumSquare149",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-mediumSquare149.jpg",
//             height: 149,
//             width: 149,
//             subType: "mediumSquare149",
//             crop_name: "mediumSquare149",
//           },
//           {
//             rank: 0,
//             subtype: "articleInline",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-articleInline-v3.jpg",
//             height: 285,
//             width: 190,
//             subType: "articleInline",
//             crop_name: "articleInline",
//           },
//           {
//             rank: 0,
//             subtype: "hpSmall",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-hpSmall-v3.jpg",
//             height: 245,
//             width: 163,
//             subType: "hpSmall",
//             crop_name: "hpSmall",
//           },
//           {
//             rank: 0,
//             subtype: "blogSmallInline",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-blogSmallInline-v3.jpg",
//             height: 227,
//             width: 151,
//             subType: "blogSmallInline",
//             crop_name: "blogSmallInline",
//           },
//           {
//             rank: 0,
//             subtype: "mediumFlexible177",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-mediumFlexible177-v3.jpg",
//             height: 266,
//             width: 177,
//             subType: "mediumFlexible177",
//             crop_name: "mediumFlexible177",
//           },
//           {
//             rank: 0,
//             subtype: "sfSpan",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-sfSpan.jpg",
//             height: 263,
//             width: 395,
//             subType: "sfSpan",
//             crop_name: "sfSpan",
//           },
//           {
//             rank: 0,
//             subtype: "largeHorizontal375",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-largeHorizontal375.jpg",
//             height: 250,
//             width: 375,
//             subType: "largeHorizontal375",
//             crop_name: "largeHorizontal375",
//           },
//           {
//             rank: 0,
//             subtype: "hpLarge",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-hpLarge-v3.jpg",
//             height: 287,
//             width: 511,
//             subType: "hpLarge",
//             crop_name: "hpLarge",
//           },
//           {
//             rank: 0,
//             subtype: "largeWidescreen573",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-largeWidescreen573-v3.jpg",
//             height: 322,
//             width: 573,
//             subType: "largeWidescreen573",
//             crop_name: "largeWidescreen573",
//           },
//           {
//             rank: 0,
//             subtype: "videoSmall",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSmall.jpg",
//             height: 281,
//             width: 500,
//             subType: "videoSmall",
//             crop_name: "videoSmall",
//           },
//           {
//             rank: 0,
//             subtype: "videoHpMedium",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoHpMedium.jpg",
//             height: 211,
//             width: 375,
//             subType: "videoHpMedium",
//             crop_name: "videoHpMedium",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine600",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine600.jpg",
//             height: 338,
//             width: 600,
//             subType: "videoSixteenByNine600",
//             crop_name: "videoSixteenByNine600",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine540",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine540.jpg",
//             height: 304,
//             width: 540,
//             subType: "videoSixteenByNine540",
//             crop_name: "videoSixteenByNine540",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine495",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine495.jpg",
//             height: 278,
//             width: 495,
//             subType: "videoSixteenByNine495",
//             crop_name: "videoSixteenByNine495",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine390",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine390.jpg",
//             height: 219,
//             width: 390,
//             subType: "videoSixteenByNine390",
//             crop_name: "videoSixteenByNine390",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine480",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine480.jpg",
//             height: 270,
//             width: 480,
//             subType: "videoSixteenByNine480",
//             crop_name: "videoSixteenByNine480",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine310",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine310.jpg",
//             height: 174,
//             width: 310,
//             subType: "videoSixteenByNine310",
//             crop_name: "videoSixteenByNine310",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine225",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine225.jpg",
//             height: 126,
//             width: 225,
//             subType: "videoSixteenByNine225",
//             crop_name: "videoSixteenByNine225",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine96",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-videoSixteenByNine96.jpg",
//             height: 54,
//             width: 96,
//             subType: "videoSixteenByNine96",
//             crop_name: "videoSixteenByNine96",
//           },
//           {
//             rank: 0,
//             subtype: "thumbnail",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-thumbStandard.jpg",
//             height: 75,
//             width: 75,
//             legacy: {
//               thumbnail:
//                 "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-thumbStandard.jpg",
//               thumbnailwidth: 75,
//               thumbnailheight: 75,
//             },
//             subType: "thumbnail",
//             crop_name: "thumbStandard",
//           },
//           {
//             rank: 0,
//             subtype: "thumbLarge",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-thumbLarge.jpg",
//             height: 150,
//             width: 150,
//             subType: "thumbLarge",
//             crop_name: "thumbLarge",
//           },
//           {
//             rank: 0,
//             subtype: "blogSmallThumb",
//             type: "image",
//             url:
//               "images/2008/08/28/health/nutrition/28reciphealth/28reciphealth-blogSmallThumb.jpg",
//             height: 50,
//             width: 50,
//             subType: "blogSmallThumb",
//             crop_name: "blogSmallThumb",
//           },
//         ],
//         headline: {
//           main: "Hot Yogurt Soup With Barley and Cilantro",
//           kicker: "Recipes for Health",
//           content_kicker: null,
//           print_headline: null,
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Soups",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Yogurt",
//             rank: 3,
//             major: "N",
//           },
//         ],
//         pub_date: "2008-08-28T19:58:01+0000",
//         document_type: "article",
//         news_desk: "Science",
//         section_name: "Health",
//         subsection_name: "Fitness & Nutrition",
//         byline: {
//           original: "By Martha Rose Shulman",
//           person: [
//             {
//               firstname: "Martha",
//               middlename: "Rose",
//               lastname: "Shulman",
//               qualifier: null,
//               title: null,
//               role: "reported",
//               organization: "",
//               rank: 1,
//             },
//           ],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/00606bb6-2c14-5247-a234-63e7d8ca1cab",
//         word_count: 315,
//         uri: "nyt://article/00606bb6-2c14-5247-a234-63e7d8ca1cab",
//       },
//       {
//         abstract:
//           "Use only the most tender kale for this salad, not the tougher black leaf variety.",
//         web_url:
//           "https://www.nytimes.com/2010/12/31/science/31recipehealthnew.html",
//         snippet:
//           "Use only the most tender kale for this salad, not the tougher black leaf variety.",
//         lead_paragraph:
//           "For a kale salad to be successful, use the most tender kale you can find and cut it into very thin filaments or chop it very finely (or both). Curly kale and Russian kale are more tender than black leaf kale. This is inspired by a wonderful salad I tried recently at the New York restaurant Northern Spy. ",
//         source: "The New York Times",
//         multimedia: [
//           {
//             rank: 0,
//             subtype: "watch308",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-watch308-v2.jpg",
//             height: 348,
//             width: 312,
//             subType: "watch308",
//             crop_name: "watch308",
//           },
//           {
//             rank: 0,
//             subtype: "watch268",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-watch268-v2.jpg",
//             height: 303,
//             width: 272,
//             subType: "watch268",
//             crop_name: "watch268",
//           },
//           {
//             rank: 0,
//             subtype: "wide",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-thumbWide.jpg",
//             height: 126,
//             width: 190,
//             legacy: {
//               widewidth: 190,
//               wideheight: 126,
//               wide:
//                 "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-thumbWide.jpg",
//             },
//             subType: "wide",
//             crop_name: "thumbWide",
//           },
//           {
//             rank: 0,
//             subtype: "videoThumb",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoThumb.jpg",
//             height: 50,
//             width: 75,
//             subType: "videoThumb",
//             crop_name: "videoThumb",
//           },
//           {
//             rank: 0,
//             subtype: "videoLarge",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoLarge.jpg",
//             height: 507,
//             width: 768,
//             subType: "videoLarge",
//             crop_name: "videoLarge",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo210",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-mediumThreeByTwo210.jpg",
//             height: 140,
//             width: 210,
//             subType: "mediumThreeByTwo210",
//             crop_name: "mediumThreeByTwo210",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo225",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-mediumThreeByTwo225.jpg",
//             height: 150,
//             width: 225,
//             subType: "mediumThreeByTwo225",
//             crop_name: "mediumThreeByTwo225",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo440",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-mediumThreeByTwo440.jpg",
//             height: 293,
//             width: 440,
//             subType: "mediumThreeByTwo440",
//             crop_name: "mediumThreeByTwo440",
//           },
//           {
//             rank: 0,
//             subtype: "facebookJumbo",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-facebookJumbo-v2.jpg",
//             height: 550,
//             width: 1050,
//             subType: "facebookJumbo",
//             crop_name: "facebookJumbo",
//           },
//           {
//             rank: 0,
//             subtype: "videoFifteenBySeven1305",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoFifteenBySeven1305.jpg",
//             height: 609,
//             width: 1305,
//             subType: "videoFifteenBySeven1305",
//             crop_name: "videoFifteenBySeven1305",
//           },
//           {
//             rank: 0,
//             subtype: "miniMoth",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-miniMoth.jpg",
//             height: 70,
//             width: 151,
//             subType: "miniMoth",
//             crop_name: "miniMoth",
//           },
//           {
//             rank: 0,
//             subtype: "windowsTile336H",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-windowsTile336H.jpg",
//             height: 336,
//             width: 694,
//             subType: "windowsTile336H",
//             crop_name: "windowsTile336H",
//           },
//           {
//             rank: 0,
//             subtype: "verticalTwoByThree735",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-verticalTwoByThree735-v2.jpg",
//             height: 1102,
//             width: 735,
//             subType: "verticalTwoByThree735",
//             crop_name: "verticalTwoByThree735",
//           },
//           {
//             rank: 0,
//             subtype: "xlarge",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-articleLarge-v2.jpg",
//             height: 381,
//             width: 600,
//             legacy: {
//               xlarge:
//                 "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-articleLarge-v2.jpg",
//               xlargewidth: 600,
//               xlargeheight: 381,
//             },
//             subType: "xlarge",
//             crop_name: "articleLarge",
//           },
//           {
//             rank: 0,
//             subtype: "blog480",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-blog480.jpg",
//             height: 305,
//             width: 480,
//             subType: "blog480",
//             crop_name: "blog480",
//           },
//           {
//             rank: 0,
//             subtype: "blog427",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-blog427.jpg",
//             height: 271,
//             width: 427,
//             subType: "blog427",
//             crop_name: "blog427",
//           },
//           {
//             rank: 0,
//             subtype: "tmagArticle",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-tmagArticle.jpg",
//             height: 376,
//             width: 592,
//             subType: "tmagArticle",
//             crop_name: "tmagArticle",
//           },
//           {
//             rank: 0,
//             subtype: "jumbo",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-jumbo-v2.jpg",
//             height: 651,
//             width: 1024,
//             subType: "jumbo",
//             crop_name: "jumbo",
//           },
//           {
//             rank: 0,
//             subtype: "blog225",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-blog225.jpg",
//             height: 143,
//             width: 225,
//             subType: "blog225",
//             crop_name: "blog225",
//           },
//           {
//             rank: 0,
//             subtype: "master675",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-master675.jpg",
//             height: 429,
//             width: 675,
//             subType: "master675",
//             crop_name: "master675",
//           },
//           {
//             rank: 0,
//             subtype: "master180",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-master180.jpg",
//             height: 114,
//             width: 180,
//             subType: "master180",
//             crop_name: "master180",
//           },
//           {
//             rank: 0,
//             subtype: "popup",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-popup-v2.jpg",
//             height: 413,
//             width: 650,
//             subType: "popup",
//             crop_name: "popup",
//           },
//           {
//             rank: 0,
//             subtype: "blog533",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-blog533.jpg",
//             height: 339,
//             width: 533,
//             subType: "blog533",
//             crop_name: "blog533",
//           },
//           {
//             rank: 0,
//             subtype: "tmagSF",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-tmagSF.jpg",
//             height: 230,
//             width: 362,
//             subType: "tmagSF",
//             crop_name: "tmagSF",
//           },
//           {
//             rank: 0,
//             subtype: "slide",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-slide.jpg",
//             height: 381,
//             width: 600,
//             subType: "slide",
//             crop_name: "slide",
//           },
//           {
//             rank: 0,
//             subtype: "superJumbo",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-superJumbo.jpg",
//             height: 1270,
//             width: 1999,
//             subType: "superJumbo",
//             crop_name: "superJumbo",
//           },
//           {
//             rank: 0,
//             subtype: "master1050",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-master1050.jpg",
//             height: 667,
//             width: 1050,
//             subType: "master1050",
//             crop_name: "master1050",
//           },
//           {
//             rank: 0,
//             subtype: "master495",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-master495.jpg",
//             height: 314,
//             width: 495,
//             subType: "master495",
//             crop_name: "master495",
//           },
//           {
//             rank: 0,
//             subtype: "master315",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-master315.jpg",
//             height: 200,
//             width: 315,
//             subType: "master315",
//             crop_name: "master315",
//           },
//           {
//             rank: 0,
//             subtype: "square320",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-square320.jpg",
//             height: 320,
//             width: 320,
//             subType: "square320",
//             crop_name: "square320",
//           },
//           {
//             rank: 0,
//             subtype: "filmstrip",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-filmstrip.jpg",
//             height: 190,
//             width: 190,
//             subType: "filmstrip",
//             crop_name: "filmstrip",
//           },
//           {
//             rank: 0,
//             subtype: "square640",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-square640.jpg",
//             height: 640,
//             width: 640,
//             subType: "square640",
//             crop_name: "square640",
//           },
//           {
//             rank: 0,
//             subtype: "moth",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-moth.jpg",
//             height: 151,
//             width: 151,
//             subType: "moth",
//             crop_name: "moth",
//           },
//           {
//             rank: 0,
//             subtype: "mediumSquare149",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-mediumSquare149.jpg",
//             height: 149,
//             width: 149,
//             subType: "mediumSquare149",
//             crop_name: "mediumSquare149",
//           },
//           {
//             rank: 0,
//             subtype: "articleInline",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-articleInline-v2.jpg",
//             height: 121,
//             width: 190,
//             subType: "articleInline",
//             crop_name: "articleInline",
//           },
//           {
//             rank: 0,
//             subtype: "hpSmall",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-hpSmall.jpg",
//             height: 104,
//             width: 163,
//             subType: "hpSmall",
//             crop_name: "hpSmall",
//           },
//           {
//             rank: 0,
//             subtype: "blogSmallInline",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-blogSmallInline.jpg",
//             height: 96,
//             width: 151,
//             subType: "blogSmallInline",
//             crop_name: "blogSmallInline",
//           },
//           {
//             rank: 0,
//             subtype: "mediumFlexible177",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-mediumFlexible177.jpg",
//             height: 112,
//             width: 177,
//             subType: "mediumFlexible177",
//             crop_name: "mediumFlexible177",
//           },
//           {
//             rank: 0,
//             subtype: "sfSpan",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-sfSpan-v2.jpg",
//             height: 263,
//             width: 395,
//             subType: "sfSpan",
//             crop_name: "sfSpan",
//           },
//           {
//             rank: 0,
//             subtype: "largeHorizontal375",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-largeHorizontal375.jpg",
//             height: 250,
//             width: 375,
//             subType: "largeHorizontal375",
//             crop_name: "largeHorizontal375",
//           },
//           {
//             rank: 0,
//             subtype: "hpLarge",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-hpLarge-v3.jpg",
//             height: 288,
//             width: 511,
//             subType: "hpLarge",
//             crop_name: "hpLarge",
//           },
//           {
//             rank: 0,
//             subtype: "largeWidescreen573",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-largeWidescreen573-v3.jpg",
//             height: 322,
//             width: 573,
//             subType: "largeWidescreen573",
//             crop_name: "largeWidescreen573",
//           },
//           {
//             rank: 0,
//             subtype: "largeWidescreen1050",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-largeWidescreen1050-v2.jpg",
//             height: 591,
//             width: 1050,
//             subType: "largeWidescreen1050",
//             crop_name: "largeWidescreen1050",
//           },
//           {
//             rank: 0,
//             subtype: "videoSmall",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSmall.jpg",
//             height: 281,
//             width: 500,
//             subType: "videoSmall",
//             crop_name: "videoSmall",
//           },
//           {
//             rank: 0,
//             subtype: "videoHpMedium",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoHpMedium.jpg",
//             height: 211,
//             width: 375,
//             subType: "videoHpMedium",
//             crop_name: "videoHpMedium",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine600",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine600.jpg",
//             height: 338,
//             width: 600,
//             subType: "videoSixteenByNine600",
//             crop_name: "videoSixteenByNine600",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine540",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine540.jpg",
//             height: 304,
//             width: 540,
//             subType: "videoSixteenByNine540",
//             crop_name: "videoSixteenByNine540",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine495",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine495.jpg",
//             height: 278,
//             width: 495,
//             subType: "videoSixteenByNine495",
//             crop_name: "videoSixteenByNine495",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine390",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine390.jpg",
//             height: 219,
//             width: 390,
//             subType: "videoSixteenByNine390",
//             crop_name: "videoSixteenByNine390",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine480",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine480.jpg",
//             height: 270,
//             width: 480,
//             subType: "videoSixteenByNine480",
//             crop_name: "videoSixteenByNine480",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine310",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine310.jpg",
//             height: 174,
//             width: 310,
//             subType: "videoSixteenByNine310",
//             crop_name: "videoSixteenByNine310",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine225",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine225.jpg",
//             height: 126,
//             width: 225,
//             subType: "videoSixteenByNine225",
//             crop_name: "videoSixteenByNine225",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine96",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine96.jpg",
//             height: 54,
//             width: 96,
//             subType: "videoSixteenByNine96",
//             crop_name: "videoSixteenByNine96",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine1050",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-videoSixteenByNine1050.jpg",
//             height: 591,
//             width: 1050,
//             subType: "videoSixteenByNine1050",
//             crop_name: "videoSixteenByNine1050",
//           },
//           {
//             rank: 0,
//             subtype: "thumbnail",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-thumbStandard-v2.jpg",
//             height: 75,
//             width: 75,
//             legacy: {
//               thumbnail:
//                 "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-thumbStandard-v2.jpg",
//               thumbnailwidth: 75,
//               thumbnailheight: 75,
//             },
//             subType: "thumbnail",
//             crop_name: "thumbStandard",
//           },
//           {
//             rank: 0,
//             subtype: "thumbLarge",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-thumbLarge.jpg",
//             height: 150,
//             width: 150,
//             subType: "thumbLarge",
//             crop_name: "thumbLarge",
//           },
//           {
//             rank: 0,
//             subtype: "blogSmallThumb",
//             type: "image",
//             url:
//               "images/2010/12/28/science/31recipehealthnew/31recipehealthnew-blogSmallThumb.jpg",
//             height: 50,
//             width: 50,
//             subType: "blogSmallThumb",
//             crop_name: "blogSmallThumb",
//           },
//         ],
//         headline: {
//           main:
//             "Kale Salad With Apples, Cheddar and Toasted Almonds or Pine Nuts",
//           kicker: "Recipes for Health",
//           content_kicker: null,
//           print_headline:
//             "Kale Salad With Apples, Cheddar and Toasted Almonds or Pine Nuts",
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Diet and Nutrition",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Salad Dressings",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Kale (Vegetable)",
//             rank: 3,
//             major: "N",
//           },
//         ],
//         pub_date: "2010-12-27T20:10:43+0000",
//         document_type: "article",
//         news_desk: "Science",
//         section_name: "Science",
//         byline: {
//           original: "By Martha Rose Shulman",
//           person: [
//             {
//               firstname: "Martha",
//               middlename: "Rose",
//               lastname: "Shulman",
//               qualifier: null,
//               title: null,
//               role: "reported",
//               organization: "",
//               rank: 1,
//             },
//           ],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/006b2444-6b6b-5396-a727-25767f51ee33",
//         word_count: 314,
//         uri: "nyt://article/006b2444-6b6b-5396-a727-25767f51ee33",
//       },
//       {
//         abstract:
//           "This is the most amazing version of tuna and bean salad I’ve ever tasted, thanks to Good Mother Stallard beans.",
//         web_url:
//           "https://www.nytimes.com/2014/07/02/health/two-bean-and-tuna-salad.html",
//         snippet:
//           "This is the most amazing version of tuna and bean salad I’ve ever tasted, thanks to Good Mother Stallard beans.",
//         lead_paragraph:
//           "I’ve always had a weakness for tuna and bean salad. This one, because I used luxurious Good Mother Stallard beans from Rancho Gordo, is quite the most amazing version of the salad I’ve ever tasted. If you want to use a more commonly available bean for it, use pintos or borlottis, but cook them yourself instead of using canned. Then you can use some of the broth in the dressing and the beans themselves will taste better because you’re in control of the seasonings. The nutritional values here are based on tuna canned in water, but you could always use tuna in olive oil for a richer version.",
//         source: "The New York Times",
//         multimedia: [
//           {
//             rank: 0,
//             subtype: "watch308",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-watch308-v2.jpg",
//             height: 348,
//             width: 312,
//             subType: "watch308",
//             crop_name: "watch308",
//           },
//           {
//             rank: 0,
//             subtype: "watch268",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-watch268-v2.jpg",
//             height: 303,
//             width: 272,
//             subType: "watch268",
//             crop_name: "watch268",
//           },
//           {
//             rank: 0,
//             subtype: "wide",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-thumbWide.jpg",
//             height: 126,
//             width: 190,
//             legacy: {
//               widewidth: 190,
//               wideheight: 126,
//               wide:
//                 "images/2014/07/01/science/02recipehealth/02recipehealth-thumbWide.jpg",
//             },
//             subType: "wide",
//             crop_name: "thumbWide",
//           },
//           {
//             rank: 0,
//             subtype: "videoThumb",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoThumb.jpg",
//             height: 50,
//             width: 75,
//             subType: "videoThumb",
//             crop_name: "videoThumb",
//           },
//           {
//             rank: 0,
//             subtype: "videoLarge",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoLarge.jpg",
//             height: 507,
//             width: 768,
//             subType: "videoLarge",
//             crop_name: "videoLarge",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo210",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-mediumThreeByTwo210.jpg",
//             height: 140,
//             width: 210,
//             subType: "mediumThreeByTwo210",
//             crop_name: "mediumThreeByTwo210",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo225",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-mediumThreeByTwo225.jpg",
//             height: 150,
//             width: 225,
//             subType: "mediumThreeByTwo225",
//             crop_name: "mediumThreeByTwo225",
//           },
//           {
//             rank: 0,
//             subtype: "mediumThreeByTwo440",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-mediumThreeByTwo440.jpg",
//             height: 293,
//             width: 440,
//             subType: "mediumThreeByTwo440",
//             crop_name: "mediumThreeByTwo440",
//           },
//           {
//             rank: 0,
//             subtype: "facebookJumbo",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-facebookJumbo-v2.jpg",
//             height: 550,
//             width: 1050,
//             subType: "facebookJumbo",
//             crop_name: "facebookJumbo",
//           },
//           {
//             rank: 0,
//             subtype: "videoFifteenBySeven1305",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoFifteenBySeven1305.jpg",
//             height: 609,
//             width: 1305,
//             subType: "videoFifteenBySeven1305",
//             crop_name: "videoFifteenBySeven1305",
//           },
//           {
//             rank: 0,
//             subtype: "videoFifteenBySeven2610",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoFifteenBySeven2610.jpg",
//             height: 1218,
//             width: 2610,
//             subType: "videoFifteenBySeven2610",
//             crop_name: "videoFifteenBySeven2610",
//           },
//           {
//             rank: 0,
//             subtype: "miniMoth",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-miniMoth.jpg",
//             height: 70,
//             width: 151,
//             subType: "miniMoth",
//             crop_name: "miniMoth",
//           },
//           {
//             rank: 0,
//             subtype: "windowsTile336H",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-windowsTile336H.jpg",
//             height: 336,
//             width: 694,
//             subType: "windowsTile336H",
//             crop_name: "windowsTile336H",
//           },
//           {
//             rank: 0,
//             subtype: "verticalTwoByThree735",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-verticalTwoByThree735-v2.jpg",
//             height: 1102,
//             width: 735,
//             subType: "verticalTwoByThree735",
//             crop_name: "verticalTwoByThree735",
//           },
//           {
//             rank: 0,
//             subtype: "xlarge",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-articleLarge.jpg",
//             height: 400,
//             width: 600,
//             legacy: {
//               xlarge:
//                 "images/2014/07/01/science/02recipehealth/02recipehealth-articleLarge.jpg",
//               xlargewidth: 600,
//               xlargeheight: 400,
//             },
//             subType: "xlarge",
//             crop_name: "articleLarge",
//           },
//           {
//             rank: 0,
//             subtype: "blog480",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-blog480.jpg",
//             height: 320,
//             width: 480,
//             subType: "blog480",
//             crop_name: "blog480",
//           },
//           {
//             rank: 0,
//             subtype: "blog427",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-blog427.jpg",
//             height: 285,
//             width: 427,
//             subType: "blog427",
//             crop_name: "blog427",
//           },
//           {
//             rank: 0,
//             subtype: "tmagArticle",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-tmagArticle.jpg",
//             height: 395,
//             width: 592,
//             subType: "tmagArticle",
//             crop_name: "tmagArticle",
//           },
//           {
//             rank: 0,
//             subtype: "jumbo",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-jumbo.jpg",
//             height: 683,
//             width: 1024,
//             subType: "jumbo",
//             crop_name: "jumbo",
//           },
//           {
//             rank: 0,
//             subtype: "blog225",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-blog225.jpg",
//             height: 150,
//             width: 225,
//             subType: "blog225",
//             crop_name: "blog225",
//           },
//           {
//             rank: 0,
//             subtype: "master675",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-master675.jpg",
//             height: 450,
//             width: 675,
//             subType: "master675",
//             crop_name: "master675",
//           },
//           {
//             rank: 0,
//             subtype: "master180",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-master180.jpg",
//             height: 120,
//             width: 180,
//             subType: "master180",
//             crop_name: "master180",
//           },
//           {
//             rank: 0,
//             subtype: "popup",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-popup.jpg",
//             height: 433,
//             width: 650,
//             subType: "popup",
//             crop_name: "popup",
//           },
//           {
//             rank: 0,
//             subtype: "blog533",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-blog533.jpg",
//             height: 355,
//             width: 533,
//             subType: "blog533",
//             crop_name: "blog533",
//           },
//           {
//             rank: 0,
//             subtype: "tmagSF",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-tmagSF.jpg",
//             height: 241,
//             width: 362,
//             subType: "tmagSF",
//             crop_name: "tmagSF",
//           },
//           {
//             rank: 0,
//             subtype: "slide",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-slide.jpg",
//             height: 400,
//             width: 600,
//             subType: "slide",
//             crop_name: "slide",
//           },
//           {
//             rank: 0,
//             subtype: "superJumbo",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-superJumbo.jpg",
//             height: 1365,
//             width: 2048,
//             subType: "superJumbo",
//             crop_name: "superJumbo",
//           },
//           {
//             rank: 0,
//             subtype: "master1050",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-master1050.jpg",
//             height: 700,
//             width: 1050,
//             subType: "master1050",
//             crop_name: "master1050",
//           },
//           {
//             rank: 0,
//             subtype: "master495",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-master495.jpg",
//             height: 330,
//             width: 495,
//             subType: "master495",
//             crop_name: "master495",
//           },
//           {
//             rank: 0,
//             subtype: "master315",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-master315.jpg",
//             height: 210,
//             width: 315,
//             subType: "master315",
//             crop_name: "master315",
//           },
//           {
//             rank: 0,
//             subtype: "square320",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-square320.jpg",
//             height: 320,
//             width: 320,
//             subType: "square320",
//             crop_name: "square320",
//           },
//           {
//             rank: 0,
//             subtype: "filmstrip",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-filmstrip.jpg",
//             height: 190,
//             width: 190,
//             subType: "filmstrip",
//             crop_name: "filmstrip",
//           },
//           {
//             rank: 0,
//             subtype: "square640",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-square640.jpg",
//             height: 640,
//             width: 640,
//             subType: "square640",
//             crop_name: "square640",
//           },
//           {
//             rank: 0,
//             subtype: "moth",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-moth.jpg",
//             height: 151,
//             width: 151,
//             subType: "moth",
//             crop_name: "moth",
//           },
//           {
//             rank: 0,
//             subtype: "mediumSquare149",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-mediumSquare149.jpg",
//             height: 149,
//             width: 149,
//             subType: "mediumSquare149",
//             crop_name: "mediumSquare149",
//           },
//           {
//             rank: 0,
//             subtype: "articleInline",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-articleInline.jpg",
//             height: 127,
//             width: 190,
//             subType: "articleInline",
//             crop_name: "articleInline",
//           },
//           {
//             rank: 0,
//             subtype: "hpSmall",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-hpSmall.jpg",
//             height: 109,
//             width: 163,
//             subType: "hpSmall",
//             crop_name: "hpSmall",
//           },
//           {
//             rank: 0,
//             subtype: "blogSmallInline",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-blogSmallInline.jpg",
//             height: 101,
//             width: 151,
//             subType: "blogSmallInline",
//             crop_name: "blogSmallInline",
//           },
//           {
//             rank: 0,
//             subtype: "mediumFlexible177",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-mediumFlexible177.jpg",
//             height: 118,
//             width: 177,
//             subType: "mediumFlexible177",
//             crop_name: "mediumFlexible177",
//           },
//           {
//             rank: 0,
//             subtype: "sfSpan",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-sfSpan.jpg",
//             height: 263,
//             width: 395,
//             subType: "sfSpan",
//             crop_name: "sfSpan",
//           },
//           {
//             rank: 0,
//             subtype: "largeHorizontal375",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-largeHorizontal375.jpg",
//             height: 250,
//             width: 375,
//             subType: "largeHorizontal375",
//             crop_name: "largeHorizontal375",
//           },
//           {
//             rank: 0,
//             subtype: "hpLarge",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-hpLarge-v3.jpg",
//             height: 288,
//             width: 511,
//             subType: "hpLarge",
//             crop_name: "hpLarge",
//           },
//           {
//             rank: 0,
//             subtype: "largeWidescreen573",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-largeWidescreen573-v3.jpg",
//             height: 322,
//             width: 573,
//             subType: "largeWidescreen573",
//             crop_name: "largeWidescreen573",
//           },
//           {
//             rank: 0,
//             subtype: "largeWidescreen1050",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-largeWidescreen1050-v2.jpg",
//             height: 591,
//             width: 1050,
//             subType: "largeWidescreen1050",
//             crop_name: "largeWidescreen1050",
//           },
//           {
//             rank: 0,
//             subtype: "videoSmall",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSmall.jpg",
//             height: 281,
//             width: 500,
//             subType: "videoSmall",
//             crop_name: "videoSmall",
//           },
//           {
//             rank: 0,
//             subtype: "videoHpMedium",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoHpMedium.jpg",
//             height: 211,
//             width: 375,
//             subType: "videoHpMedium",
//             crop_name: "videoHpMedium",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine600",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine600.jpg",
//             height: 338,
//             width: 600,
//             subType: "videoSixteenByNine600",
//             crop_name: "videoSixteenByNine600",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine540",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine540.jpg",
//             height: 304,
//             width: 540,
//             subType: "videoSixteenByNine540",
//             crop_name: "videoSixteenByNine540",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine495",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine495.jpg",
//             height: 278,
//             width: 495,
//             subType: "videoSixteenByNine495",
//             crop_name: "videoSixteenByNine495",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine390",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine390.jpg",
//             height: 219,
//             width: 390,
//             subType: "videoSixteenByNine390",
//             crop_name: "videoSixteenByNine390",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine480",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine480.jpg",
//             height: 270,
//             width: 480,
//             subType: "videoSixteenByNine480",
//             crop_name: "videoSixteenByNine480",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine310",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine310.jpg",
//             height: 174,
//             width: 310,
//             subType: "videoSixteenByNine310",
//             crop_name: "videoSixteenByNine310",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine225",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine225.jpg",
//             height: 126,
//             width: 225,
//             subType: "videoSixteenByNine225",
//             crop_name: "videoSixteenByNine225",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine96",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine96.jpg",
//             height: 54,
//             width: 96,
//             subType: "videoSixteenByNine96",
//             crop_name: "videoSixteenByNine96",
//           },
//           {
//             rank: 0,
//             subtype: "videoSixteenByNine1050",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-videoSixteenByNine1050.jpg",
//             height: 591,
//             width: 1050,
//             subType: "videoSixteenByNine1050",
//             crop_name: "videoSixteenByNine1050",
//           },
//           {
//             rank: 0,
//             subtype: "thumbnail",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-thumbStandard.jpg",
//             height: 75,
//             width: 75,
//             legacy: {
//               thumbnail:
//                 "images/2014/07/01/science/02recipehealth/02recipehealth-thumbStandard.jpg",
//               thumbnailwidth: 75,
//               thumbnailheight: 75,
//             },
//             subType: "thumbnail",
//             crop_name: "thumbStandard",
//           },
//           {
//             rank: 0,
//             subtype: "thumbLarge",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-thumbLarge.jpg",
//             height: 150,
//             width: 150,
//             subType: "thumbLarge",
//             crop_name: "thumbLarge",
//           },
//           {
//             rank: 0,
//             subtype: "blogSmallThumb",
//             type: "image",
//             url:
//               "images/2014/07/01/science/02recipehealth/02recipehealth-blogSmallThumb.jpg",
//             height: 50,
//             width: 50,
//             subType: "blogSmallThumb",
//             crop_name: "blogSmallThumb",
//           },
//         ],
//         headline: {
//           main: "Two-Bean and Tuna Salad",
//           kicker: null,
//           content_kicker: null,
//           print_headline: null,
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Tuna",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Salads",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Beans",
//             rank: 3,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 4,
//             major: "N",
//           },
//         ],
//         pub_date: "2014-07-01T14:51:56+0000",
//         document_type: "article",
//         news_desk: "Science",
//         section_name: "Health",
//         byline: {
//           original: "By Martha Rose Shulman",
//           person: [
//             {
//               firstname: "Martha",
//               middlename: "Rose",
//               lastname: "Shulman",
//               qualifier: null,
//               title: null,
//               role: "reported",
//               organization: "",
//               rank: 1,
//             },
//           ],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/0076a698-6738-549f-a57b-3300d8b3e0c7",
//         word_count: 421,
//         uri: "nyt://article/0076a698-6738-549f-a57b-3300d8b3e0c7",
//       },
//       {
//         abstract:
//           "6 tablespoons long-grain white rice 1¼ cups whole blanched almonds 1 1-inch stick cinnamon About 1 cup sugar.",
//         web_url:
//           "https://www.nytimes.com/2008/07/27/magazine/27food-t-003.html",
//         snippet: "",
//         lead_paragraph:
//           "6 tablespoons long-grain white rice 1¼ cups whole blanched almonds 1 1-inch stick cinnamon About 1 cup sugar.",
//         source: "The New York Times",
//         multimedia: [],
//         headline: {
//           main: "Horchata",
//           kicker: "Recipes",
//           content_kicker: null,
//           print_headline: null,
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Cooking and Cookbooks",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "glocations",
//             value: "Mexico",
//             rank: 3,
//             major: "N",
//           },
//         ],
//         pub_date: "2008-07-27T15:39:00+0000",
//         document_type: "article",
//         news_desk: "Magazine",
//         section_name: "Magazine",
//         byline: {
//           original: null,
//           person: [],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/00cf1437-78ac-57fb-a2f9-e3d85904fa97",
//         word_count: 179,
//         uri: "nyt://article/00cf1437-78ac-57fb-a2f9-e3d85904fa97",
//       },
//       {
//         abstract: "A recipe for Tournedos of Beef With Pot-au-Feu Vegetables.",
//         web_url: "https://www.nytimes.com/2008/02/06/dining/061prex.html",
//         snippet: "A recipe for Tournedos of Beef With Pot-au-Feu Vegetables.",
//         lead_paragraph: "Time: 50 minutes",
//         print_section: "F",
//         print_page: "8",
//         source: "The New York Times",
//         multimedia: [],
//         headline: {
//           main: "Recipe: Tournedos of Beef With Pot-au-Feu Vegetables",
//           kicker: null,
//           content_kicker: null,
//           print_headline:
//             "Tournedos of Beef With Pot-au-Feu Vegetables Time: 50 minutes",
//           name: null,
//           seo: null,
//           sub: null,
//         },
//         keywords: [
//           {
//             name: "subject",
//             value: "Vegetables",
//             rank: 1,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Recipes",
//             rank: 2,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Cooking and Cookbooks",
//             rank: 3,
//             major: "N",
//           },
//           {
//             name: "subject",
//             value: "Meat",
//             rank: 4,
//             major: "N",
//           },
//         ],
//         pub_date: "2008-02-06T05:00:00+0000",
//         document_type: "article",
//         news_desk: "Dining",
//         section_name: "Food",
//         byline: {
//           original: null,
//           person: [],
//           organization: null,
//         },
//         type_of_material: "recipe",
//         _id: "nyt://article/013e6883-c054-5aaf-b3bf-253b1178a618",
//         word_count: 235,
//         uri: "nyt://article/013e6883-c054-5aaf-b3bf-253b1178a618",
//       },
//     ],
//     meta: {
//       hits: 25416,
//       offset: 0,
//       time: 16,
//     },
//   },
// });
