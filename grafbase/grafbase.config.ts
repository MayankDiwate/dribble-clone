import { auth, config, graph } from "@grafbase/sdk";

const g = graph.Standalone();

// @ts-ignore
const user = g.model("User", {
  name: g.string().length({ min: 2, max: 20 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(),
});

// @ts-ignore
const project = g.model("Project", {
  title: g.string().length({ min: 3 }),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string().search(),
  createdBy: g.ref(user),
});

user.projects = g.ref(project);

const jwt = auth.JWT({
  issuer: "grafbase",
  secret: g.env("NEXTAUTH_SECRET"),
});

config({
  schema: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private(),
  },
});
config({
  schema: g,
  auth: {
    providers: [project],
    rules: (rules) => {
      rules.public().read();
    },
  },
});
config({
  schema: g,
  auth: {
    providers: [user],
    rules: (rules) => {
      rules.public().read();
      rules.private().create().delete().update();
    },
  },
});
