export type Tag = {
  label: string;
  color: "slack" | "restream" | "ls6" | "camera" | "audio" | "graphics" | "time" | "thu";
};

export type Task = {
  id: string;
  title: string;
  tags?: Tag[];
  note?: string;
};

export type Section = {
  label: string;
  tasks: Task[];
};

export type Phase = {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  deadline: string;
  color: "schedule" | "connect" | "prepare" | "produce";
  sections: Section[];
};

export type Role = {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  phases: Phase[];
};

function getAllPhaseTasks(phase: Phase): Task[] {
  return phase.sections.flatMap((s) => s.tasks);
}

export function getPhaseTaskCount(phase: Phase): number {
  return getAllPhaseTasks(phase).length;
}

export function getPhaseTaskIds(phase: Phase): string[] {
  return getAllPhaseTasks(phase).map((t) => t.id);
}

export function getAllPhases(): Phase[] {
  return WORKFLOW_ROLES.flatMap((r) => r.phases);
}

export function getAllTaskIds(): string[] {
  return getAllPhases().flatMap(getPhaseTaskIds);
}

export const WORKFLOW_ROLES: Role[] = [
  {
    id: "td",
    title: "Technical Director",
    shortTitle: "Tech Dir.",
    icon: "🎬",
    phases: [
      {
        id: "td-start",
        title: "Start",
        shortTitle: "Start",
        icon: "🚀",
        deadline: "📋 Broadcast Day Begins",
        color: "schedule",
        sections: [
          {
            label: "Coordination",
            tasks: [
              {
                id: "td1",
                title: "Join Slack Huddle — coordinate with the entire broadcast team",
                tags: [{ label: "Slack", color: "slack" }],
              },
            ],
          },
        ],
      },
      {
        id: "td-preprod",
        title: "Pre-Production",
        shortTitle: "Pre-Prod",
        icon: "🎛️",
        deadline: "🔧 Setup & Configuration",
        color: "prepare",
        sections: [
          {
            label: "Software & Signals",
            tasks: [
              {
                id: "td2",
                title: "Update LiveStream Studio 6 to the latest version",
                tags: [{ label: "LS6", color: "ls6" }],
              },
              {
                id: "td3",
                title: "Check all Video and Audio signals through LS6",
                tags: [{ label: "LS6", color: "ls6" }, { label: "Audio", color: "audio" }],
              },
              {
                id: "td4",
                title: "Position Camera Angles in correct locations",
                tags: [{ label: "Camera", color: "camera" }],
              },
              {
                id: "td5",
                title: "Setup Virtual Guests — add to input list and test video & audio",
                tags: [{ label: "LS6", color: "ls6" }, { label: "Audio", color: "audio" }],
              },
            ],
          },
          {
            label: "Audio Configuration",
            tasks: [
              {
                id: "td6",
                title: "Configure Sound Output to External Headphones (NOT Cam Link 4K)",
                tags: [{ label: "Audio", color: "audio" }],
              },
              {
                id: "td7",
                title: "Set Audio Monitors: turn OFF (Cameras 1–4, Slides, Ivor mic, Atonte mic, Stream Out); turn ON (External Headphones)",
                tags: [{ label: "Audio", color: "audio" }],
                note: "Ensure only External Headphones monitor channel is active to avoid feedback loops.",
              },
            ],
          },
          {
            label: "Graphics & Stream Setup",
            tasks: [
              {
                id: "td8",
                title: "Configure Lower Thirds with correct name spelling for all participants",
              },
              {
                id: "td9",
                title: "Design Guest View Grids if applicable",
              },
              {
                id: "td10",
                title: "Set Restream Key — retrieve and configure from Restream platform",
                tags: [{ label: "Restream", color: "restream" }],
              },
              {
                id: "td11",
                title: "Check SD Card Storage — minimum 1 hour 20 minutes available on each card",
                tags: [{ label: "Camera", color: "camera" }],
              },
              {
                id: "td12",
                title: "Readjust Camera Angles after Sabbath School ends",
                tags: [{ label: "Camera", color: "camera" }, { label: "10:45 AM", color: "time" }],
              },
            ],
          },
        ],
      },
      {
        id: "td-prod",
        title: "Production",
        shortTitle: "Live",
        icon: "🔴",
        deadline: "🔴 Live Broadcast",
        color: "produce",
        sections: [
          {
            label: "Studio Mic Control",
            tasks: [
              {
                id: "td13",
                title: "Studio Segments: set Ivor and Atonte's mics to RED — always heard by viewers",
                tags: [{ label: "Audio", color: "audio" }],
                note: "RED mic status means the mic is live to the audience at all times during studio segments.",
              },
              {
                id: "td14",
                title: "Announcements: Keep Atonte Live by RED-ing her mic during the announcement segment",
                tags: [{ label: "Audio", color: "audio" }],
              },
            ],
          },
          {
            label: "Recording",
            tasks: [
              {
                id: "td15",
                title: "Start Sermon Recording on all 4 cameras + LS6",
                tags: [{ label: "Camera", color: "camera" }, { label: "LS6", color: "ls6" }],
                note: "Skip guest camera if a guest speaker is presenting — record only in-house cameras.",
              },
              {
                id: "td16",
                title: "Live Switching & Monitoring — manage camera cuts and audio throughout the service",
                tags: [{ label: "Camera", color: "camera" }, { label: "LS6", color: "ls6" }],
              },
              {
                id: "td17",
                title: "Stop Recording on all cameras and LS6 after sermon completion",
                tags: [{ label: "Camera", color: "camera" }, { label: "LS6", color: "ls6" }],
              },
            ],
          },
        ],
      },
      {
        id: "td-end",
        title: "End — Wrap Up",
        shortTitle: "Wrap Up",
        icon: "✅",
        deadline: "📋 Post-Broadcast",
        color: "connect",
        sections: [
          {
            label: "Post-Broadcast",
            tasks: [
              {
                id: "td18",
                title: "Un-Red Studio Mics after broadcast ends — remove all RED status",
                tags: [{ label: "Audio", color: "audio" }],
              },
              {
                id: "td19",
                title: "Broadcast Complete! 🎉 — review recordings and confirm all files saved",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cb",
    title: "Comms / Backup Director",
    shortTitle: "Comms",
    icon: "📡",
    phases: [
      {
        id: "cb-preprod",
        title: "Pre-Production",
        shortTitle: "Pre-Prod",
        icon: "🎛️",
        deadline: "🔧 Setup",
        color: "prepare",
        sections: [
          {
            label: "Studio Setup",
            tasks: [
              {
                id: "cb1",
                title: "Set Backdrops — ensure both table and wall backdrops are in place",
              },
              {
                id: "cb2",
                title: "Start Slack Huddle from both the LMC-Comms and LS6-Audio machines",
                tags: [{ label: "Slack", color: "slack" }],
              },
              {
                id: "cb3",
                title: "Configure Audio Settings on LMC-Comms — set volume to MAX then lower to 0 to calibrate",
                tags: [{ label: "Audio", color: "audio" }],
              },
              {
                id: "cb4",
                title: "Setup Sermon Slides and confirm they are projecting correctly",
              },
              {
                id: "cb5",
                title: "Open Restream Chat on the \"LMC – Streaming\" server for studio visibility",
                tags: [{ label: "Restream", color: "restream" }],
              },
            ],
          },
        ],
      },
      {
        id: "cb-prod",
        title: "During Production",
        shortTitle: "Live",
        icon: "🔴",
        deadline: "🔴 Live Broadcast",
        color: "produce",
        sections: [
          {
            label: "Live Monitoring",
            tasks: [
              {
                id: "cb6",
                title: "Monitor Slack for updates and changes from the Technical Director",
                tags: [{ label: "Slack", color: "slack" }],
              },
              {
                id: "cb7",
                title: "Send messages to the studio team via the Comms server as needed",
                tags: [{ label: "Slack", color: "slack" }],
              },
              {
                id: "cb8",
                title: "Stay ready to take over as Technical Director if needed",
                note: "Be familiar with all Technical Director steps. In an emergency, you should be able to assume the role immediately.",
              },
            ],
          },
        ],
      },
      {
        id: "cb-post",
        title: "Post-Production",
        shortTitle: "Wrap Up",
        icon: "✅",
        deadline: "📋 Wrap Up",
        color: "connect",
        sections: [
          {
            label: "Wrap Up",
            tasks: [
              {
                id: "cb9",
                title: "Broadcast Complete! 🎉 — close Restream and begin preparing for next week",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "gh",
    title: "Graphics Host",
    shortTitle: "Graphics",
    icon: "🎨",
    phases: [
      {
        id: "gh-preprod",
        title: "Pre-Production",
        shortTitle: "Pre-Prod",
        icon: "🗓️",
        deadline: "⏰ Complete by Thursday Night",
        color: "schedule",
        sections: [
          {
            label: "Graphics Prep — Complete by Thursday 9 PM",
            tasks: [
              {
                id: "gh1",
                title: "Import Media (videos and graphics) — check Mighty Networks for the show rundown",
                tags: [{ label: "Thu Deadline", color: "thu" }, { label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh2",
                title: "Order Graphics correctly according to the show rundown",
                tags: [{ label: "Thu Deadline", color: "thu" }, { label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh3",
                title: "Test All Media — verify all videos and images display correctly",
                tags: [{ label: "Thu Deadline", color: "thu" }, { label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh4",
                title: "Clean Up Downloads — move browser downloads folder to trash after importing",
                tags: [{ label: "Thu Deadline", color: "thu" }],
              },
            ],
          },
        ],
      },
      {
        id: "gh-day",
        title: "Broadcast Day",
        shortTitle: "Broadcast Day",
        icon: "📅",
        deadline: "🗓️ Saturday — Before Service",
        color: "prepare",
        sections: [
          {
            label: "Pre-Service",
            tasks: [
              {
                id: "gh5",
                title: "Join Slack Huddle before service begins to coordinate with the team",
                tags: [{ label: "Slack", color: "slack" }],
              },
            ],
          },
        ],
      },
      {
        id: "gh-prod",
        title: "During Production",
        shortTitle: "Live",
        icon: "🔴",
        deadline: "🔴 Live Broadcast",
        color: "produce",
        sections: [
          {
            label: "Live Graphics",
            tasks: [
              {
                id: "gh6",
                title: "Monitor Slack updates for any last-minute changes from the Technical Director",
                tags: [{ label: "Slack", color: "slack" }],
              },
              {
                id: "gh7",
                title: "Execute Graphics Transitions per the Technical Director's calls",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh8",
                title: "Adapt to Changes On-the-Fly — stay flexible for any last-minute adjustments",
              },
            ],
          },
        ],
      },
      {
        id: "gh-post",
        title: "Post-Production",
        shortTitle: "Wrap Up",
        icon: "✅",
        deadline: "📋 Wrap Up",
        color: "connect",
        sections: [
          {
            label: "Wrap Up",
            tasks: [
              {
                id: "gh9",
                title: "Broadcast Complete! 🎉 — begin preparing next week's graphics and media",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const BUMPER_LIST: string[] = [];

export const TIMELINE_EVENTS = [
  { time: "Wed 9 PM", event: "Graphics prep deadline", day: 3, hour: 21, min: 0 },
  { time: "Fri 9 PM", event: "Rehearsal & testing complete", day: 5, hour: 21, min: 0 },
  { time: "11:00 AM", event: "Team arrives, setup begins", day: 6, hour: 11, min: 0 },
  { time: "12:00 PM 🔴", event: "Service begins — GO LIVE", day: 6, hour: 12, min: 0 },
  { time: "~4:00 PM", event: "Service ends · Wrap up", day: 6, hour: 16, min: 0 },
];
