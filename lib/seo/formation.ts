export type FormationGuide = {
  slug: string;
  name: string;
  formatSize: number;
  intro: string;
  shape: string;
  roles: { position: string; job: string }[];
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
};

export const FORMATION_GUIDES: FormationGuide[] = [
  // ───────────── 11-a-side ─────────────
  {
    slug: "4-3-3",
    name: "4-3-3",
    formatSize: 11,
    intro:
      "The 4-3-3 is a front-foot formation: four defenders, three midfielders and three forwards. It is built around width in attack and a compact midfield.",
    shape:
      "A goalkeeper, a back four (two centre-backs and two full-backs), three central midfielders, and a front three of two wide forwards and a centre-forward.",
    roles: [
      {
        position: "Full-backs",
        job: "Provide width and overlap the wingers when you attack.",
      },
      {
        position: "Holding midfielder",
        job: "Sits in front of the defence, breaks up play and starts attacks.",
      },
      {
        position: "Wide forwards",
        job: "Stretch the pitch, take on full-backs and cut inside or cross.",
      },
      {
        position: "Centre-forward",
        job: "Leads the line, holds the ball up and finishes chances.",
      },
    ],
    strengths: [
      "Strong attacking width and a natural passing triangle in midfield",
      "Three forwards press high and keep the opposition back line busy",
    ],
    weaknesses: [
      "Space can open behind attacking full-backs",
      "Needs hard-working midfielders to cover the whole pitch",
    ],
    bestFor:
      "Teams with quick wingers and a mobile midfield who want to control possession.",
  },
  {
    slug: "4-2-3-1",
    name: "4-2-3-1",
    formatSize: 11,
    intro:
      "The 4-2-3-1 is one of the most balanced shapes in modern football. Two midfielders protect the defence, a line of three supports a lone striker, and the team stays compact without giving up attacking numbers.",
    shape:
      "A goalkeeper, a back four, two holding midfielders, a line of three attacking midfielders (a central playmaker with a wide player on each side) and one striker.",
    roles: [
      {
        position: "Holding pair",
        job: "Shield the back four. One usually stays deeper while the other carries the ball forward.",
      },
      {
        position: "Number 10",
        job: "Finds space between the opposition's lines and links midfield to the striker.",
      },
      {
        position: "Wide attackers",
        job: "Cut inside or beat their full-back and cross, then track back when you lose the ball.",
      },
      {
        position: "Lone striker",
        job: "Pins the centre-backs, holds the ball up and finishes chances.",
      },
    ],
    strengths: [
      "A solid base of two screening midfielders with four attackers still ahead of them",
      "Easy to switch between attacking and defending shapes without changing personnel",
    ],
    weaknesses: [
      "The striker can be isolated if the three behind him are slow to support",
      "Depends on one creative player in the number 10 role",
    ],
    bestFor:
      "Teams with one strong link-up striker and a creative player who can play behind him.",
  },
  {
    slug: "3-5-2",
    name: "3-5-2",
    formatSize: 11,
    intro:
      "The 3-5-2 crowds the middle of the pitch. Three centre-backs, five midfielders including two wing-backs, and two strikers give you numbers in the centre and a real goal threat up front.",
    shape:
      "A goalkeeper, three centre-backs, a midfield five made of two wing-backs and three central midfielders, and a pair of strikers.",
    roles: [
      {
        position: "Centre-backs",
        job: "Cover the width of the box. The outer two step out to challenge wide players.",
      },
      {
        position: "Wing-backs",
        job: "Run the whole touchline: a defender when you lose the ball, a winger when you have it.",
      },
      {
        position: "Central midfielders",
        job: "One holds, two share ball-winning and carrying. Together they control the centre.",
      },
      {
        position: "Strike partnership",
        job: "Usually one target man or runner and one link player who drops in to help.",
      },
    ],
    strengths: [
      "Numbers in midfield, with two strikers always occupying the centre-backs",
      "Wing-backs give width without costing you a forward",
    ],
    weaknesses: [
      "Wing-backs need exceptional stamina, and space opens behind them if they are caught high",
      "Wide areas can be exposed against a team with two real wingers",
    ],
    bestFor:
      "Teams with fit, quick wide players and a good strike pair, especially against sides that play one striker.",
  },
  {
    slug: "4-4-2",
    name: "4-4-2",
    formatSize: 11,
    intro:
      "The classic. Two flat banks of four with two strikers up front is easy to learn, easy to organise and still very effective at grassroots level.",
    shape:
      "A goalkeeper, a back four, a flat midfield four (two central players and two wide midfielders) and two strikers.",
    roles: [
      {
        position: "Central midfielders",
        job: "One protects, one supports attacks, and they must stay close together to avoid gaps.",
      },
      {
        position: "Wide midfielders",
        job: "Supply crosses in attack and drop back to help the full-backs.",
      },
      {
        position: "Strikers",
        job: "Often a big player who holds the ball up and a quicker one who runs in behind.",
      },
    ],
    strengths: [
      "Every player has a clear job, so it can be coached in very little training time",
      "Two strikers give a direct goal threat and cover the width of the attack",
    ],
    weaknesses: [
      "Only two central midfielders, so a three-man midfield can outnumber you",
      "If the wide midfielders do not track back, the full-backs get stretched",
    ],
    bestFor:
      "Teams that want a simple, well-drilled shape with limited training time and two good strikers.",
  },
  {
    slug: "4-1-4-1",
    name: "4-1-4-1",
    formatSize: 11,
    intro:
      "The 4-1-4-1 puts one dedicated holding midfielder in front of the defence and a flat line of four midfielders ahead of him, with a single striker. It is compact and hard to play through.",
    shape:
      "A goalkeeper, a back four, one defensive midfielder, a line of four midfielders (two central, two wide) and a lone striker.",
    roles: [
      {
        position: "Anchor midfielder",
        job: "Screens the back four, breaks up attacks and always gives a simple passing option.",
      },
      {
        position: "Central midfielders",
        job: "Link defence and attack. One of them should push up to support the striker.",
      },
      {
        position: "Wide midfielders",
        job: "Attack the flanks and drop back to form two banks of four.",
      },
      {
        position: "Lone striker",
        job: "Stretches the defence and presses the centre-backs.",
      },
    ],
    strengths: [
      "Very difficult to play through the middle",
      "The anchor keeps the back four organised and protected",
    ],
    weaknesses: [
      "The striker can be left alone unless midfielders arrive late in the box",
      "Can become passive if the whole team sits too deep",
    ],
    bestFor:
      "Teams that want to be hard to beat and hit on the counter, with a reliable holding player.",
  },
  {
    slug: "4-1-2-3",
    name: "4-1-2-3",
    formatSize: 11,
    intro:
      "The 4-1-2-3 is a variation on the 4-3-3 that makes the midfield a triangle with its point at the back: one holding player and two ahead of him. You keep the front three and add extra protection.",
    shape:
      "A goalkeeper, a back four, a single holding midfielder, two central midfielders in front of him, and a front three of two wide forwards and a centre-forward.",
    roles: [
      {
        position: "Holding midfielder",
        job: "Sits at the base of midfield, sets the tempo and drops between the centre-backs when building from the back.",
      },
      {
        position: "Two central midfielders",
        job: "Link play and support the forwards by arriving in the box.",
      },
      {
        position: "Wide forwards",
        job: "Stretch the pitch and cut inside to shoot.",
      },
      {
        position: "Centre-forward",
        job: "Leads the line and gives the team a focal point.",
      },
    ],
    strengths: [
      "Two advanced midfielders and three forwards overload the attacking third",
      "The anchor gives the team a stable base behind the attack",
    ],
    weaknesses: [
      "The single holder is under heavy pressure when the midfield is bypassed",
      "Full-backs have to cover large wide spaces",
    ],
    bestFor:
      "Teams that want to dominate the ball and press high, with a calm, disciplined player in the holding role.",
  },
  {
    slug: "3-4-2-1",
    name: "3-4-2-1",
    formatSize: 11,
    intro:
      "The 3-4-2-1 is a back-three formation built around two creative players tucked in behind a single striker. Wing-backs give you width, and the two attackers work the pockets between the lines.",
    shape:
      "A goalkeeper, three centre-backs, four midfielders (two wing-backs and two central midfielders), two attacking midfielders and one striker.",
    roles: [
      {
        position: "Centre-backs",
        job: "A three-man line, with the outer two free to step out and win the ball.",
      },
      {
        position: "Wing-backs",
        job: "Provide all the width on both sides, attacking and recovering.",
      },
      {
        position: "Central midfielders",
        job: "Protect the centre of the pitch and win second balls.",
      },
      {
        position: "Two attacking midfielders",
        job: "Pick up the ball between the lines, support the striker and arrive in the box.",
      },
    ],
    strengths: [
      "Skilful players in tight spaces behind the striker",
      "Wing-backs and three centre-backs cover the full width of the pitch",
    ],
    weaknesses: [
      "Wing-backs need stamina to cover the whole flank",
      "The striker can be isolated if the two attackers do not join in, and two central midfielders can be overrun",
    ],
    bestFor:
      "Teams with two skilful, mobile attacking midfielders and wide players who can run all game.",
  },
  {
    slug: "3-4-3",
    name: "3-4-3",
    formatSize: 11,
    intro:
      "The 3-4-3 is the attack-minded back-three formation: three defenders, four midfielders and a front three. It is bold, front-foot and built to press high.",
    shape:
      "A goalkeeper, three centre-backs, a midfield four of two wing-backs and two central midfielders, and a front three.",
    roles: [
      {
        position: "Centre-backs",
        job: "Need pace and good positioning, because there is plenty of space to defend behind them.",
      },
      {
        position: "Wing-backs",
        job: "Push high to join the attack, then drop to form a back five when you lose the ball.",
      },
      {
        position: "Central midfielders",
        job: "Only two, so they must be energetic and win the ball quickly.",
      },
      {
        position: "Front three",
        job: "A central striker flanked by two forwards who can stay wide or drift inside.",
      },
    ],
    strengths: [
      "Lots of attacking players close to the opposition goal",
      "The shape helps you press high and create overloads out wide",
    ],
    weaknesses: [
      "Two central midfielders can be overrun by a three-man midfield",
      "Leaves big gaps behind you if the press is beaten",
    ],
    bestFor:
      "Teams with plenty of attacking talent, good fitness and the confidence to press, or any side chasing a goal.",
  },
  {
    slug: "4-5-1",
    name: "4-5-1",
    formatSize: 11,
    intro:
      "The 4-5-1 packs the midfield with five players and leaves one striker up front. It is a solid, compact choice when you want to protect a result or stay hard to beat.",
    shape:
      "A goalkeeper, a back four, five midfielders (three in the centre and one wide on each side) and a lone striker.",
    roles: [
      {
        position: "Central midfield three",
        job: "One holds while the other two share ball-winning and carrying.",
      },
      {
        position: "Wide midfielders",
        job: "Protect the full-backs and join attacks when space opens.",
      },
      {
        position: "Lone striker",
        job: "Holds the ball up, brings others into play and works the channels.",
      },
    ],
    strengths: [
      "Compact and difficult to break down through the middle",
      "Numbers in midfield make it easier to win and keep the ball",
    ],
    weaknesses: [
      "The striker can be isolated for long periods",
      "If the team defends too deep it struggles to get out",
    ],
    bestFor:
      "Teams facing stronger opponents, protecting a lead, or counter-attacking through one hold-up striker.",
  },
  {
    slug: "4-2-2-2",
    name: "4-2-2-2",
    formatSize: 11,
    intro:
      "The 4-2-2-2 is a narrow shape sometimes called the magic box. Two holding midfielders sit behind two attacking midfielders, with two strikers ahead of them.",
    shape:
      "A goalkeeper, a back four, two holding midfielders, two attacking midfielders who play narrow, and two strikers.",
    roles: [
      {
        position: "Holding pair",
        job: "Protect the back four and recycle possession.",
      },
      {
        position: "Attacking midfielders",
        job: "Play narrow between the lines, join the strikers and sometimes drift wide.",
      },
      {
        position: "Full-backs",
        job: "Supply the width, because the midfielders ahead of them stay central.",
      },
      {
        position: "Strikers",
        job: "A pair that interchange, with one dropping short and one running beyond.",
      },
    ],
    strengths: [
      "A strong presence in the centre, with four players close to the opposition goal",
      "Good for quick passing combinations through the middle",
    ],
    weaknesses: [
      "Little natural width, so it relies heavily on the full-backs",
      "The flanks can be exposed when the full-backs push up",
    ],
    bestFor:
      "Teams with technical central players and athletic full-backs who want to control the middle of the pitch.",
  },
  {
    slug: "5-4-1",
    name: "5-4-1",
    formatSize: 11,
    intro:
      "The 5-4-1 is a defensive formation: a back five, a line of four midfielders and one striker. It is the shape for protecting a lead or defending against a stronger side.",
    shape:
      "A goalkeeper, five defenders (three in the middle and one wide on each side), four midfielders and a lone striker.",
    roles: [
      {
        position: "Centre-backs",
        job: "Stay compact and defend the penalty area as a trio.",
      },
      {
        position: "Wide defenders",
        job: "Cover the touchlines and push up when you counter-attack.",
      },
      {
        position: "Midfield four",
        job: "Two banks of players who protect the defence and look to break forward.",
      },
      {
        position: "Lone striker",
        job: "A quick, hard-working player who chases long balls and leads the counter.",
      },
    ],
    strengths: [
      "Very hard to break down, with many players behind the ball",
      "A good base for fast counter-attacks",
    ],
    weaknesses: [
      "Difficult to create chances, and the striker is often isolated",
      "Can become too passive if few players get forward on the counter",
    ],
    bestFor:
      "Holding a lead, playing a stronger team, or any match where a draw or narrow win is the goal.",
  },
  {
    slug: "4-3-1-2",
    name: "4-3-1-2",
    formatSize: 11,
    intro:
      "The 4-3-1-2 uses three central midfielders, one playmaker behind two strikers, and a back four. It is narrow and built for passing through the middle of the pitch.",
    shape:
      "A goalkeeper, a back four, three central midfielders, one attacking midfielder and two strikers.",
    roles: [
      {
        position: "Midfield three",
        job: "Control the middle and cover wide areas when the full-backs go forward.",
      },
      {
        position: "Attacking midfielder",
        job: "The creative hub who feeds both strikers and arrives in the box.",
      },
      {
        position: "Strikers",
        job: "Two forwards who combine, with one dropping short and one running in behind.",
      },
      {
        position: "Full-backs",
        job: "Must supply the width, because the shape itself is narrow.",
      },
    ],
    strengths: [
      "A strong central presence with plenty of support for two strikers",
      "Good for keeping the ball and combining in small spaces",
    ],
    weaknesses: [
      "Wide areas open up if the full-backs cannot cover them",
      "Needs a quality player in the attacking midfield role to work well",
    ],
    bestFor:
      "Teams with a strong creative player, a good striker partnership and full-backs with plenty of stamina.",
  },
  {
    slug: "3-4-1-2",
    name: "3-4-1-2",
    formatSize: 11,
    intro:
      "The 3-4-1-2 combines a back three and a midfield four with one playmaker behind two strikers. It is flexible and suits teams with strong wing-backs.",
    shape:
      "A goalkeeper, three centre-backs, four midfielders (two wing-backs and two central midfielders), one attacking midfielder and two strikers.",
    roles: [
      {
        position: "Centre-backs",
        job: "Three defenders, with the middle one covering for the others.",
      },
      {
        position: "Wing-backs",
        job: "Provide all the width and must run both ways for the full game.",
      },
      {
        position: "Central midfielders",
        job: "Protect the centre and feed the playmaker.",
      },
      {
        position: "Playmaker and two strikers",
        job: "The playmaker links midfield to a strike pair who move around the centre-backs.",
      },
    ],
    strengths: [
      "A solid back three with two strikers who keep defenders busy",
      "The playmaker connects midfield and attack in the central channel",
    ],
    weaknesses: [
      "A heavy workload for the wing-backs",
      "Two central midfielders can be outnumbered, and the strikers need to link well",
    ],
    bestFor:
      "Teams with a quality striker pair, a creative playmaker and wing-backs who can cover the flank.",
  },

  // ───────────── 9-a-side ─────────────
  {
    slug: "3-3-2",
    name: "3-3-2",
    formatSize: 9,
    intro:
      "The 3-3-2 is a balanced shape for 9-a-side: a back three, a midfield three and two forwards. It covers the width of a smaller pitch without leaving anyone out of position.",
    shape:
      "A goalkeeper, three defenders (left, centre and right), three midfielders and two forwards.",
    roles: [
      {
        position: "Back three",
        job: "The centre defender covers the middle while the two wide defenders stay close to protect the width.",
      },
      {
        position: "Midfield three",
        job: "One sits deeper while the other two link defence and attack.",
      },
      {
        position: "Two forwards",
        job: "Work as a pair, with one holding up the ball and one running in behind.",
      },
    ],
    strengths: [
      "Balanced across the pitch, with clear roles for every player",
      "Three at the back and three in midfield cover the width of a smaller pitch well",
    ],
    weaknesses: [
      "Little natural width in attack because the wide defenders stay back",
      "The forwards can be isolated if the midfield does not push up",
    ],
    bestFor:
      "Teams new to 9-a-side who want a simple, balanced shape that is easy to organise.",
  },
  {
    slug: "3-2-3",
    name: "3-2-3",
    formatSize: 9,
    intro:
      "The 3-2-3 is the attacking option at 9-a-side: a back three, only two midfielders and a front three. It gives you width and a lot of players near the opposition goal.",
    shape:
      "A goalkeeper, three defenders, two central midfielders and three forwards (two wide and one central).",
    roles: [
      {
        position: "Back three",
        job: "Defend the width of the pitch and start attacks with short passes.",
      },
      {
        position: "Two midfielders",
        job: "Cover a lot of ground, linking the defence to the front three.",
      },
      {
        position: "Wide forwards",
        job: "Stay high and wide to stretch the opposition and cross or cut in.",
      },
      {
        position: "Central forward",
        job: "Leads the line and gets on the end of crosses.",
      },
    ],
    strengths: [
      "Three forwards create plenty of chances and stretch the defence",
      "Wide players give the team good width on a small pitch",
    ],
    weaknesses: [
      "Only two midfielders, so the middle can be outnumbered",
      "Forwards must be willing to work back when you lose the ball",
    ],
    bestFor: "Teams with strong attackers who want to play on the front foot.",
  },

  // ───────────── 8-a-side ─────────────
  {
    slug: "2-3-2",
    name: "2-3-2",
    formatSize: 8,
    intro:
      "The 2-3-2 is a balanced shape for 8-a-side, with two defenders, a midfield three and two forwards. Each line has a partner to work with, which makes it easy for players to understand their roles.",
    shape:
      "A goalkeeper, two defenders, three midfielders (two wide and one central) and two forwards.",
    roles: [
      {
        position: "Two defenders",
        job: "Work as a pair, with one covering when the other steps out.",
      },
      {
        position: "Midfield three",
        job: "The wide players supply width and the central player links the lines.",
      },
      {
        position: "Two forwards",
        job: "Pair up in attack, pressing together and sharing the finishing.",
      },
    ],
    strengths: [
      "Balanced and easy to understand, with a partner for almost every player",
      "Three midfielders give you control of the middle of the pitch",
    ],
    weaknesses: [
      "Only two defenders, so a quick striker can be hard to contain",
      "Midfielders must cover a lot of ground to help in defence",
    ],
    bestFor:
      "Teams that want a simple, balanced 8-a-side shape with equal focus on defending and attacking.",
  },
  {
    slug: "3-3-1",
    name: "3-3-1",
    formatSize: 8,
    intro:
      "The 3-3-1 is the solid option at 8-a-side: three defenders, three midfielders and a single striker. It is hard to beat and good at moving the ball out from the back.",
    shape: "A goalkeeper, three defenders, three midfielders and one forward.",
    roles: [
      {
        position: "Back three",
        job: "Give the team cover across the width of the pitch and a safe base to build from.",
      },
      {
        position: "Midfield three",
        job: "Keep the ball moving and support the lone forward.",
      },
      {
        position: "Lone forward",
        job: "Holds the ball up and brings the midfielders into the attack.",
      },
    ],
    strengths: [
      "Six players behind the ball make it very difficult to score against",
      "Good for patient, passing football out from the back",
    ],
    weaknesses: [
      "Only one forward, so goals have to come from midfield runners",
      "The striker can feel isolated if the midfield does not push on",
    ],
    bestFor:
      "Teams that want to be solid and build from the back, or are playing a stronger side.",
  },
  {
    slug: "3-2-2",
    name: "3-2-2",
    formatSize: 8,
    intro:
      "The 3-2-2 keeps a back three but adds a second striker, leaving two midfielders in between. It is a straightforward shape that gets the ball forward quickly.",
    shape: "A goalkeeper, three defenders, two midfielders and two forwards.",
    roles: [
      {
        position: "Back three",
        job: "Protect the goal and play the ball forward early.",
      },
      {
        position: "Two midfielders",
        job: "Connect the defence and the forwards, and move up and down the pitch.",
      },
      {
        position: "Two forwards",
        job: "Play as a pair, with one dropping deeper and one running beyond the defence.",
      },
    ],
    strengths: [
      "A secure back line with two forwards to keep opposing defenders busy",
      "Direct and easy for young or newer players to understand",
    ],
    weaknesses: [
      "Only two midfielders, so the middle can become stretched",
      "Little natural width unless the forwards or midfielders move wide",
    ],
    bestFor:
      "Teams that like to play forward quickly with a pair of strikers and a secure back three.",
  },

  // ───────────── 7-a-side ─────────────
  {
    slug: "2-3-1",
    name: "2-3-1",
    formatSize: 7,
    intro:
      "The 2-3-1 is one of the most common formations for 7-a-side. A line of three in midfield gives you width and control, with two defenders behind and one striker up front.",
    shape:
      "A goalkeeper, two defenders, three midfielders (two wide and one central) and one forward.",
    roles: [
      {
        position: "Two defenders",
        job: "Cover the goal and work as a pair, with one always staying back.",
      },
      {
        position: "Wide midfielders",
        job: "Provide width in attack and help defend the flanks.",
      },
      {
        position: "Central midfielder",
        job: "Links defence to attack and supports the striker.",
      },
      {
        position: "Forward",
        job: "Holds up the ball, runs the channels and finishes.",
      },
    ],
    strengths: [
      "Good width across a smaller pitch and plenty of passing options",
      "Balanced, so players can swap roles easily",
    ],
    weaknesses: [
      "A lone striker can be isolated",
      "Two defenders can be stretched by a quick opposing forward",
    ],
    bestFor:
      "Teams that want a balanced 7-a-side shape with good width and control of the ball.",
  },
  {
    slug: "3-2-1",
    name: "3-2-1",
    formatSize: 7,
    intro:
      "The 3-2-1 is a more defensive 7-a-side formation. A back three and two midfielders keep the team compact and give the lone striker support from behind.",
    shape: "A goalkeeper, three defenders, two midfielders and one forward.",
    roles: [
      {
        position: "Back three",
        job: "Give the team a solid base across the width of the pitch.",
      },
      {
        position: "Two midfielders",
        job: "Shield the defence and support the forward, running a lot in both directions.",
      },
      {
        position: "Forward",
        job: "Leads the line and holds the ball up for the midfielders to join.",
      },
    ],
    strengths: [
      "Hard to score against, because six players stay behind the forward",
      "Gives young or less experienced defenders extra cover",
    ],
    weaknesses: [
      "Fewer attackers, so you may struggle to create chances",
      "Only two midfielders to cover the width of the pitch",
    ],
    bestFor:
      "Teams that want to be solid defensively or are playing a stronger opponent.",
  },

  // ───────────── 5-a-side ─────────────
  {
    slug: "1-2-1",
    name: "1-2-1",
    formatSize: 5,
    intro:
      "The 1-2-1 is the classic diamond for 5-a-side. One player at the back, two across the middle and one up front means everyone has a clear job and passing angles in every direction.",
    shape:
      "A goalkeeper and four outfield players in a diamond: one defender, two wide players and one player at the top.",
    roles: [
      {
        position: "Back player",
        job: "Stays behind the ball, covers the goal and starts attacks with a safe pass.",
      },
      {
        position: "Two wide players",
        job: "Cover the sides, support both attack and defence, and run the most.",
      },
      {
        position: "Top player",
        job: "Plays near the opposition goal, holds the ball up and finishes.",
      },
    ],
    strengths: [
      "Clear passing angles all over the pitch",
      "Players can rotate positions to keep the opposition guessing",
    ],
    weaknesses: [
      "The wide players do a lot of running",
      "Only one player stays back, so quick counters can be dangerous",
    ],
    bestFor: "Teams that like to pass and move, with players happy to rotate.",
  },
  {
    slug: "2-1-1",
    name: "2-1-1",
    formatSize: 5,
    intro:
      "The 2-1-1 is a solid 5-a-side shape with two defenders, one player in the middle and one forward. It keeps two players back at all times, so it suits teams that want to be hard to beat.",
    shape:
      "A goalkeeper and four outfield players: two defenders, one in the middle and one forward.",
    roles: [
      {
        position: "Two defenders",
        job: "Stay back together and cover the goal, one stepping out while the other covers.",
      },
      {
        position: "Middle player",
        job: "Links defence and attack and supports whoever has the ball.",
      },
      {
        position: "Forward",
        job: "Plays high up the pitch, holds the ball and finishes chances.",
      },
    ],
    strengths: [
      "Hard to score against, with two defenders always behind the ball",
      "A simple structure that is easy to organise",
    ],
    weaknesses: [
      "Only one forward, so you can struggle to create chances",
      "The middle player has a lot of ground to cover",
    ],
    bestFor: "Teams that want to defend first and play on the counter-attack.",
  },
];
