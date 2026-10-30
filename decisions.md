# Decision log: My Closet for Pinterest

Built with Claude as a pair of hands. For each choice: what was asked, what was made, what we kept or changed, and why. This feeds the case study's Explorations, Design decisions and Reflections sections.

## Setup (29 Oct)

- **Feature and audience:** taken from our Project 1 scope write-up. "My Closet" is a digital wardrobe inside Pinterest, for 18–30 fashion-focused users.
- **Flows:** we gave Claude our own prompt spec (8 screens, 4 clickable flows). It is building exactly those flows, not new ones.
- **Key screen:** Claude suggested Screen 4, Complete the Look, because that's where the feature happens. **We agreed.** It will get 2–3 versions for us to pick from.
- **Design system source:** Claude found that Pinterest publishes its design system, Gestalt, as a token package. We used it instead of eyedropping screenshots. Our prompt's `#E60023` matches Gestalt's red exactly.
- **Images:** we were offered three options: (a) our own photos, (b) labelled grey tiles, (c) a mix. **We chose (b).** Photos get dropped in later in Figma, so the screens show layout and content without fake product photos.
- **Frame size:** we didn't know our Figma frame size. Claude used iPhone 17 (402 × 874), because that's the phone we test on.
- **Reference:** our 12 hi-fi screens (made earlier) are the layout to follow.

## Step 2: components

- **Built only what the flows need:** 21 components. Gestalt names where Gestalt has the component (Button, IconButton, ButtonToggle, Tag, Tabs, TextField, Badge, Toast, SlimBanner, Sheet), Pinterest's existing pieces (Pin, Board, tab bar), and HIG names for list rows and sheets.
- **New components (don't exist in Pinterest), flagged for the log:**
  - Avatar stage: you wearing the look, with the inspo pin in the corner
  - Progress checklist: the loading state, "Matching with your closet…"
  - Look card: the saved look, with the inspo pin and a status line
  - Style branch card
  - Profile entry card, "My Closet · New"
- **Button size:** Gestalt says lg (48px) is the only size for Pinner surfaces, so every button is lg. The exception is the small Shop button on product cards, which is md (40px) so it fits a card a third of the screen wide. Its tap area is stretched to 44px, the HIG minimum. *(Open question for us: keep it md, or make it lg?)*
- **Filter chips:** they look 40px tall, like our reference screens, but the tap area is 44px, the HIG minimum.
- **Status isn't colour alone:** "All pieces owned" uses green **plus** a check icon **plus** words. "2 pieces to shop" uses a bag icon.
- **Contrast checked:**

  | Text and background | Ratio |
  |---|---|
  | White on Pinterest red | 4.78:1 |
  | Grey subtle text on white | 6.02 |
  | Grey subtle text on cream tiles | 5.46 |
  | Grey subtle text on grey chips | 4.86 |

  All pass 4.5:1.
- **Font:** Pinterest's font (Pin Sans) isn't public, so the screens use the iPhone system font. This will look slightly different from the real app.
- **Product content:** product names, brands and prices ("Odile", "Hollis & Wren", $210, $148) come from our reference screens, not from real stores. *(To check: replace them with real shoppable pins before the final case study?)*


## Round 2: our feedback on the components, and the first screens (29 Oct)

We gave six notes. Here is what was made for each, and what is still open.

1. **Avatar feels generic → added a setup moment (`02-avatar-setup`).**
   - **Options:** skin tone (Gestalt's 16 tones), hair style (long, bob, curly, bun), hair colour (4), body shape (straight, curvy, broad shoulders, full).
   - **Style:** illustrated and faceless, not realistic. Garments keep identifying details: ribbing, collar and buttons, lapels, tweed flecks, plaid, trouser crease.
   - **Copy:** "Only used to show how clothes hang. Only you see it." Skip is always there.
   - *Open:* the body shape labels are Claude's wording. They need testing with real users, because body shape is sensitive. Would pictures alone, with no words, be better?
2. **Real photos instead of illustrations → every image is now a photo slot.**
   - Clothing tiles are cutouts on cream. Pins and products are full-bleed.
   - Drop files into `images/` and they appear on every screen; the file names are in `images/README.md`.
   - The avatar stays illustrated. So: photos for things, illustration for you.
   - *Waiting on us:* the actual photos. Claude can't download them.
3. **Closet top half too heavy → compact header.** The avatar is now a small card (104 × 152) beside Style me, so the grid starts about a third of the way down.
   - Chose a compact card over collapse-on-scroll, because a collapsing header can't be shown in a static screenshot or a Figma frame.
   - *Option for later:* collapse it as well.
4. **More masonry →**
   - **Closet:** 3 columns, each piece keeps its own shape (coats and trousers tall, shoes short, tops square).
   - **Looks:** 2 columns with mixed card heights.
   - **For You and the branch feed:** already masonry.
5. **Fewer chips and labels.**
   - **Removed:** "You", "Your inspo", "Styled with your closet", "Just saved", the check badges on owned pieces, and the "Pairs with 3 pieces you own" chip on images.
   - **Moved into quiet text:** "3 of 5 pieces from your closet · 2 to shop" is a subtitle now, and "Goes with 3 of your pieces" is grey text under the pin.
   - **Kept, because they carry real information:** "New" on a just-added piece and on the profile entry card, and the status line on look cards ("2 pieces to shop" / "All pieces owned").
   - **Dropped item names under closet tiles:** once photos are in, the photo is the name.
6. **Style branches as a map (`18-style-branches`).**
   - Your aesthetic sits in the centre and three branches radiate out. Tapping a branch shows its description, key pieces and fit count below the map.
   - Dotted lines hint at further steps: "Dotted lines open up as your closet grows."
   - Fit counts come from our closet: Preppy 6, Quiet luxury 6, Grunge 3.
   - *Next:* refine it in Figma, as we suggested.

**Key screen versions (Complete the look):**
- **A, stage and rows:** our reference, quieter. Linked into the flow for now.
- **B, side by side:** the pin next to you, then one list of all 5 pieces, with "In your closet" or a Shop button on each.
- **C, toggle:** a Gestalt SegmentedControl switches between the pin and you. The pieces are shown as pins.
- *Waiting on us:* which one to keep.

**Content that doesn't come from us yet:**
- Our prompt names 8 closet items, not 12, so the closet says 8 (9 after the blazer).
- The brown leather tote has no brand or price. The argyle vest, knee-high boots and wool trousers have no brand or price either.
- The Grunge description and its key pieces are Claude's draft.
- The second shop piece in Complete the look (the tote) is Claude's reading of the bag in our reference avatar.

**Still open from round 1:**
- The Shop button size (40 vs 48).
- Whether Ava Moreno is our persona.

## Key screen: three versions (decided 29 Oct)
- **Asked for:** three layouts for Complete the look.
- **Made:**
  - A: avatar stage, then "From my closet" and "To complete it" rows
  - B: the pin and you side by side, then one list of all the pieces
  - C: a toggle between the pin and you, with the pieces as pins
- **Kept: A.** *(Write our reason here.)*
- **Dropped:**
  - B: one list made owned and shop pieces easy to scan, but it lost the big "this is you" moment.
  - C: hiding one of the two images behind a toggle meant you couldn't compare the pin and the avatar at once.
- **Claude's view:** Claude leaned towards B, and we overruled it. Note this in Reflections.

## Round 3: real clothing photos (29 Oct)
- **Asked:** can single pieces be cut out of full-body outfit pins?
  - **Tried:** a clothing-cutout model on 4 pins from our feed.
  - **Result:** no. Arms, phones and hair cover the clothes, so the cutouts came out broken or kept parts of the person.
  - **Decided:** use flat-lay photos of single pieces instead.
- **Made:** 11 cutouts from our flat-lay photos. They replaced the illustrated dark-academia closet in the Closet tab.
- **Item names are Claude's** (for example "Butterfly hooded top", "Brown cap-sleeve jacket"). Rename them if we call them something else.
- **Avatar now wears our clothes:** mustard ringer tee, light bootcut jeans, buckle boots. Claude added short sleeves to the avatar for tees.
- **Open:** the rest of the prototype still tells the dark-academia story: the inspo pin, Complete the look, Looks, For You and the style map. Our real closet is Y2K and thrift. Re-theme? *(Waiting on us.)*

## Round 4: re-theme to Y2K grunge and 2000s streetwear (29 Oct)
- **Decided by us:** re-theme to Y2K grunge and 2000s streetwear, because it matches our real closet and style. Keep Claude's item names. Credit photos to Depop.
- **Key flow content:**
  - **Inspo pin:** our own outfit photo (plaid bomber, light denim).
  - **To complete it:** the gray plaid zip jacket and the light-wash baggy jeans (both from Depop).
  - **From my closet:** the black buckle boots.
  - The look reads "1 of 3 pieces from your closet · 2 to shop".
- **Upload flow now closes the loop:** you buy the gray plaid zip jacket, upload it, and the saved look updates ("1 look updated").
- **Claude's drafts, to check or replace:**
  - Board names: Y2K Grunge (24), 2000s Streetwear (18). The pin counts are kept from before.
  - Look names: "Plaid bomber, light denim", "Ringer tee & bootcuts", "Red tee, brown zip-up", "Yellow plaid layers".
  - Style branches: 2000s streetwear, Western, Indie sleaze, with their descriptions and key pieces.
  - Fit counts, counted from our 11 pieces: 8, 6 and 4.
  - "Goes with N of your pieces" counts on For You.
  - Prices: none yet on the Depop items.
- **Design idea from this round (Claude's):** our closet already has light bootcut jeans, close to the baggy jeans the look asks for. The feature could suggest "You have something close" before suggesting a buy. That fits our "not pushy" design statement. *Worth testing?*

## Round 5: board pins (29 Oct)
- **Added by us:** 3 outfit pins to the Y2K Grunge board, next to our own outfit photo. Pin names are Claude's: "Red tee & light denim", "Yellow polo & baggy jeans", "Stripes, scarf & tall boots".
- **Board cover:** Y2K Grunge now uses real pins on the profile and in the board picker.
- **Content:** we're happy with the re-themed content.
- **To credit in the case study:** the original posters of these 3 pins.

## Round 6: working prototype and video (29 Oct)
- **Asked for:** a working, interactive prototype, and a recording of it running.
- **Made:** `prototype.js`, plain JavaScript that remembers state between screens.
  - **Avatar:** choices on the setup screen now show on every screen.
  - **Closet filters:** All, Tops, Bottoms, Outerwear, Shoes and Accessories work, with an empty message for Accessories.
  - **Board:** tapping a pin selects it. Complete the look then recreates that pin.
  - **Four inspo pins break down into pieces:**
    - Plaid bomber: 1 of 3 from our closet.
    - Red tee: 2 of 4.
    - Yellow polo: 2 of 4.
    - Stripes: 1 of 4.
    - The red, yellow and stripes breakdowns are Claude's reading of the photos.
  - **Save look:** opens the sheet. Saving adds the look to the Looks tab, and its filters work.
  - **Upload closes the loop:** uploading the gray plaid zip jacket adds it to the closet. The plaid look then changes to "2 of 3 · 1 to shop".
  - **Smaller interactions:** product Save toggles, Shop shows a toast, and the style map switches branches.
  - **Reset:** "Reset prototype" on the index page clears everything.
- **Video:** `my-closet-walkthrough.mp4`, 94 seconds, recorded automatically in a browser at iPhone 17 size. Grey dots show taps.
  - It shows: profile → avatar edit → closet filters → Style me → board → pick pin → matching → Complete the look → Shop → Save to My Looks and a board → Looks → For You → Style branches → branch feed → product Save → Upload the jacket → the look updates.
- **Still to do:** the case study may want a real-phone screen recording as well, since this one is a browser, not an iPhone.
