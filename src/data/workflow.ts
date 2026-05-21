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
                title: "Join the \"huddle\" in Slack for the service from your personal machine",
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
            label: "Pre-Production Checklist",
            tasks: [
              {
                id: "td2",
                title: "LiveStream Studio 6 is up to date",
                tags: [{ label: "LS6", color: "ls6" }],
              },
              {
                id: "td-cam-power",
                title: "Cameras 1–4 and cooling fans for each camera are powered on",
                tags: [{ label: "Camera", color: "camera" }],
                note: "Power on via the web power switch using IP address 192.168.1.102. Must be done from any of the servers based in Alabama, not your personal machine. Username: admin · Password: Livingmanna1844",
              },
              {
                id: "td3",
                title: "All video/audio signals are seen and heard through LS6",
                tags: [{ label: "LS6", color: "ls6" }, { label: "Audio", color: "audio" }],
              },
              {
                id: "td4",
                title: "All camera angles are in their correct positions",
                tags: [{ label: "Camera", color: "camera" }],
                note: "Readjust angles after Sabbath School — see the During Production phase.",
              },
              {
                id: "td5a",
                title: "All virtual guests are added to the video input list",
                tags: [{ label: "LS6", color: "ls6" }],
              },
              {
                id: "td5b",
                title: "All virtual guests can be seen and heard prior to the start of the broadcast",
                tags: [{ label: "LS6", color: "ls6" }, { label: "Audio", color: "audio" }],
              },
              {
                id: "td6",
                title: "System sound output is set to \"External Headphones\" (Apple Logo → System Settings → Sound)",
                tags: [{ label: "Audio", color: "audio" }],
              },
              {
                id: "td7",
                title: "Cameras 1–4, \"Slides\", Ivor's mic, Atonte's mic, and \"Stream Out\" audio monitors are TURNED OFF; all other audio monitors are TURNED ON",
                tags: [{ label: "Audio", color: "audio" }],
                note: "All other audio monitors should remain ON to ensure the crew can hear these channels via Slack.",
              },
              {
                id: "td8",
                title: "Names/info (with correct spelling) for lower thirds are correctly configured (if applicable)",
              },
              {
                id: "td9",
                title: "Guest view grids are correctly set and designed (if applicable)",
              },
              {
                id: "td10",
                title: "Stream key is retrieved and set (from Restream)",
                tags: [{ label: "Restream", color: "restream" }],
              },
              {
                id: "td11",
                title: "SD cards are inserted into cameras and adequate storage is available for recording (at least 2hrs on each card)",
                tags: [{ label: "Camera", color: "camera" }],
              },
              {
                id: "td-vguest-comms",
                title: "To verbally communicate with virtual guests in the LS6 waiting room: 'red' the \"Broadcast Team (Slack)\" audio channel — be sure to \"un-red\" it once done",
                tags: [{ label: "Slack", color: "slack" }, { label: "Audio", color: "audio" }],
              },
              {
                id: "td-studio-comms",
                title: "To communicate with those physically in the studio: give the order to the Comms role — they will activate audio via house speakers or earpieces",
              },
            ],
          },
        ],
      },
      {
        id: "td-prod",
        title: "During Production",
        shortTitle: "Live",
        icon: "🔴",
        deadline: "🔴 Live Broadcast",
        color: "produce",
        sections: [
          {
            label: "During Production",
            tasks: [
              {
                id: "td13",
                title: "FOR STUDIO SEGMENTS: Ivor and Atonte's mics should be \"RED\" to ensure they are always heard when live",
                tags: [{ label: "Audio", color: "audio" }],
                note: "Be sure to \"Un-Red\" their mics once they are finished with the segment — otherwise the audience will still be able to hear them.",
              },
              {
                id: "td14",
                title: "FOR ANNOUNCEMENTS SEGMENT: \"red\" Atonte's mic to ensure she is still heard by the audience when switching to the graphics signal",
                tags: [{ label: "Audio", color: "audio" }],
              },
              {
                id: "td12",
                title: "After Sabbath School, readjust camera angles for sermon",
                tags: [{ label: "Camera", color: "camera" }],
              },
            ],
          },
        ],
      },
      {
        id: "td-end",
        title: "Post",
        shortTitle: "Post",
        icon: "✅",
        deadline: "📋 Post-Broadcast",
        color: "connect",
        sections: [
          {
            label: "Post",
            tasks: [
              {
                id: "td-cam-wait",
                title: "Don't power down the cameras immediately after the sermon — leave them on for about 10 minutes after the recording ends",
                tags: [{ label: "Camera", color: "camera" }],
                note: "Cameras often take time to successfully write footage to the internal cards after a recording session, especially longer sessions.",
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
                title: "Set Backdrops — ensure both table and wall backdrops are in place before stream",
              },
              {
                id: "cb2",
                title: "Start Slack Huddle from both LMC-Comms and LS6-Audio servers",
                tags: [{ label: "Slack", color: "slack" }],
                note: "LMC-Comms input audio: \"MG-XU\" · LS6-Audio input audio: \"Cable Creation\" mic. Verify audio settings are correctly configured on both servers.",
              },
              {
                id: "cb3",
                title: "Configure earpiece/studio audio — ready to mute/unmute Slack and LS6 audio on Technical Director's command via LMC-Earpiece server",
                tags: [{ label: "Audio", color: "audio" }],
              },
              {
                id: "cb4",
                title: "Setup Sermon Slides — confirm they are projecting correctly on the LMC-Slides server",
              },
              {
                id: "cb-slides-refresh",
                title: "Refresh the sermon slides link in the browser moments before the sermon starts",
                note: "Ideally refresh during the sermon bumper video to ensure a clean, up-to-date connection.",
              },
              {
                id: "cb5",
                title: "Open Restream Chat on the \"LMC – Streaming\" server so comments can be seen from the studio",
                tags: [{ label: "Restream", color: "restream" }],
              },
            ],
          },
          {
            label: "Guest Setup (if applicable)",
            tasks: [
              {
                id: "cb-clark",
                title: "Danny & Jackie Clark setup — if joining: launch Vimeo guest link in Chrome on LMC-Clark server",
                note: "Video input: \"CamLink 4k\" · Audio input: \"Volt\". All machine passwords: Livingmanna1844 (PIN: 1844). Ensure they are set up and ready from their end before the service starts.",
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
            label: "Recording",
            tasks: [
              {
                id: "cb-rec-start",
                title: "RECORD Cameras 1–4: start recording from each camera server at the start of the sermon",
                tags: [{ label: "Camera", color: "camera" }],
              },
              {
                id: "cb-rec-adjust",
                title: "Make camera adjustments (lighting, focus, etc.) remotely on Technical Director's command",
                tags: [{ label: "Camera", color: "camera" }],
              },
              {
                id: "cb-rec-stop",
                title: "Stop all camera recordings when sermon is complete",
                tags: [{ label: "Camera", color: "camera" }],
              },
            ],
          },
          {
            label: "Live Monitoring & Comms",
            tasks: [
              {
                id: "cb6",
                title: "Monitor Slack for updates and changes from the Technical Director",
                tags: [{ label: "Slack", color: "slack" }],
              },
              {
                id: "cb7",
                title: "Send messages to the studio team via LMC-Comms server using Keynote",
                tags: [{ label: "Slack", color: "slack" }],
              },
              {
                id: "cb-backdrop",
                title: "Work with Graphics to set up table and wall backdrop for sermon (rotating slides) — start both presentations simultaneously to ensure sync",
              },
              {
                id: "cb8",
                title: "Stay ready to take over as Technical Director if needed",
                note: "Be familiar with all Technical Director steps. In an emergency, assume the role immediately.",
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
        deadline: "⏰ Complete by Wednesday Night",
        color: "schedule",
        sections: [
          {
            label: "Graphics Prep — Complete by Wednesday 9 PM",
            tasks: [
              {
                id: "gh1",
                title: "Import Media (videos and graphics) — check Mighty Networks for the show rundown",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh2",
                title: "Order graphics correctly according to the show rundown",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh3",
                title: "Test All Media — verify all videos and images display correctly",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh4",
                title: "Clean Up Downloads — move browser-downloaded content to trash after adding to ProPresenter",
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
                id: "gh-backdrop",
                title: "Work with Comms to set up table and wall backdrop for the sermon",
              },
              {
                id: "gh6",
                title: "Monitor Slack for any last-minute changes from the Technical Director",
                tags: [{ label: "Slack", color: "slack" }],
              },
              {
                id: "gh7",
                title: "Execute Graphics Transitions per the Technical Director's calls",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh-slides-backup",
                title: "Be ready to take over Slides via the Slides server using arrow keys if pastor's clicker fails",
                note: "Remote into the Slides server and use arrow keys to advance slides on the Technical Director's command.",
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
