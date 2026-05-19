export const CONTACTS = [
  { id: 1, name: "Yuki Tanaka", role: "Design Lead", initials: "YT", color: "#B5D4F4", textColor: "#0C447C", online: true },
  { id: 2, name: "Marcus Webb", role: "Engineering", initials: "MW", color: "#9FE1CB", textColor: "#085041", online: true },
  { id: 3, name: "Priya Nair", role: "Product", initials: "PN", color: "#F4C0D1", textColor: "#72243E", online: false },
  { id: 4, name: "Dev Okonkwo", role: "Research", initials: "DO", color: "#FAC775", textColor: "#633806", online: true },
  { id: 5, name: "Sofia Reyes", role: "Marketing", initials: "SR", color: "#C0DD97", textColor: "#27500A", online: false },
];

export const INITIAL_MESSAGES = {
  1: [
    {
      id: 1,
      from: "them",
      text: "Hey! Did you get a chance to review the new component specs?",
      ts: "10:14 AM",
    },
    {
      id: 2,
      from: "me",
      text: "Yeah, just went through them. The spacing system looks really clean.",
      ts: "10:16 AM",
    },
    {
      id: 3,
      from: "them",
      text: "Thanks! I was a bit worried about the mobile breakpoints.",
      ts: "10:17 AM",
    },
  ],
  2: [
    {
      id: 1,
      from: "them",
      text: "The build is passing now. Can you do a quick review?",
      ts: "9:45 AM",
    },
    {
      id: 2,
      from: "me",
      text: "On it — will have notes by noon.",
      ts: "9:50 AM",
    },
  ],
  3: [
    {
      id: 1,
      from: "them",
      text: "Roadmap sync tomorrow at 2pm, you in?",
      ts: "Yesterday",
    },
    { id: 2, from: "me", text: "Blocked, can we do 3?", ts: "Yesterday" },
    { id: 3, from: "them", text: "Works for me!", ts: "Yesterday" },
  ],
  4: [
    {
      id: 1,
      from: "them",
      text: "Sharing the latest user study findings with you now.",
      ts: "Monday",
    },
  ],
  5: [
    {
      id: 1,
      from: "them",
      text: "Launch blog post is ready for your eyes 👀",
      ts: "Friday",
    },
    { id: 2, from: "me", text: "Will read tonight!", ts: "Friday" },
  ],
};