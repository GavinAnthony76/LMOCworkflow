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
                id: "td-multiscreen",
                title: "Multi screens are correctly configured in LS6 (LS6 Settings → Multi Screen): CamLink 4K and Samsung should both be listed as connected displays and both set to \"Program Output\"",
                tags: [{ label: "LS6", color: "ls6" }],
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
            label: "Pre-Production Checklist",
            tasks: [
              {
                id: "cb1",
                title: "Ensure both table and wall backdrops are set correctly before the start of stream (change to sermon backdrops after sabbath school/announcements)",
              },
              {
                id: "cb2",
                title: "Start \"huddle\" in Slack in the #broadcast-team group and join the huddle from \"LMC-Comms\" and \"LS6-Audio\" servers",
                tags: [{ label: "Slack", color: "slack" }],
                note: "Be sure audio settings are correctly configured. The input audio for \"LMC-Comms\" should be set to \"MG-XU\". The input audio for \"LS6-Audio\" should be set to \"Cable Creation\" mic.",
              },
              {
                id: "cb4",
                title: "Ensure sermon slides are projecting on the \"LMC-Slides\" server before the start of the sermon",
                note: "Be sure to refresh the link in the browser moments before the sermon starts (ideally during the sermon bumper video).",
              },
              {
                id: "cb7",
                title: "Be ready to transmit messages via the LMC-Comms server to talent in studio during stream (using Keynote)",
              },
              {
                id: "cb3",
                title: "Be ready to mute/unmute both Slack and LS6 audio in earpiece and/or studio (audible) audio using the LMC-Earpiece server on Technical Director's command",
                tags: [{ label: "Audio", color: "audio" }],
              },
              {
                id: "cb8",
                title: "Be ready to jump in and take over the technical director's position during the stream, should it become necessary",
              },
              {
                id: "cb5",
                title: "Ensure Restream is opened on the \"LMC – Streaming\" server (to the \"chat\" tab) before the stream starts so that comments can be seen from the studio",
                tags: [{ label: "Restream", color: "restream" }],
              },
              {
                id: "cb-clark",
                title: "If Danny and Jackie Clark are joining the stream: ensure they are set up and ready from their end — launch the Vimeo guest link from Google Chrome on their dedicated server (LMC-Clark)",
                note: "Their video input signal should be set to \"CamLink 4k\" and their audio should be set to the \"Volt\" audio. Passwords for all machines: Livingmanna1844. If machine asks for a pin, it would be 1844.",
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
            label: "During Production",
            tasks: [
              {
                id: "cb-rec-start",
                title: "RECORD Cameras 1–4 from each server upon the start of the sermon — remote into these servers to make any camera adjustments (lighting, focus, etc.) based on the Technical Director's wishes",
                tags: [{ label: "Camera", color: "camera" }],
              },
              {
                id: "cb-rec-stop",
                title: "Stop recordings when sermon is complete",
                tags: [{ label: "Camera", color: "camera" }],
              },
              {
                id: "cb-backdrop",
                title: "Work with whoever is in the Graphics role to setup the table and wall backdrop for the sermon (rotating slides) — be sure both presentations are started simultaneously to ensure proper sync",
              },
            ],
          },
        ],
      },
      {
        id: "cb-post",
        title: "Post",
        shortTitle: "Post",
        icon: "✅",
        deadline: "📋 Wrap Up",
        color: "connect",
        sections: [
          {
            label: "Post",
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
            label: "Graphics Prep — Complete by Wednesday Night",
            tasks: [
              {
                id: "gh1",
                title: "Import all videos and graphics necessary for weekly sabbath stream. Reference the rundown sheet from the Mighty Networks platform for media sources.",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh2",
                title: "Ensure all graphics are correctly ordered and accounted for by no later than Wednesday night.",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh3",
                title: "Ensure that all videos play through and all images display successfully.",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh4",
                title: "If any graphics content has been downloaded to the graphics server from an internet browser, be sure to move it to trash after it has been added to ProPresenter.",
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
            label: "Before Service",
            tasks: [
              {
                id: "gh5",
                title: "Join the \"huddle\" in Slack for the service from your personal machine.",
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
            label: "During Production",
            tasks: [
              {
                id: "gh7",
                title: "Make necessary graphic transitions during the stream according to the technical director's call.",
                tags: [{ label: "Graphics", color: "graphics" }],
              },
              {
                id: "gh-backdrop",
                title: "Work with whoever is in the Comms role to setup the table and wall backdrop for the sermon.",
              },
              {
                id: "gh-slides-backup",
                title: "Be ready to take over controls for Slides during sermon (via Slides server) using arrow keys, should pastor's clicker fail.",
                note: "Note: Everyone in each of these roles should be continually tuned into Slack for any updates or last-minute changes and be ready to adapt to these changes on-the-fly.",
              },
            ],
          },
        ],
      },
      {
        id: "gh-post",
        title: "Post",
        shortTitle: "Post",
        icon: "✅",
        deadline: "📋 Wrap Up",
        color: "connect",
        sections: [
          {
            label: "Post",
            tasks: [
              {
                id: "gh9",
                title: "Broadcast Complete! 🎉 — begin preparing next week's graphics and media.",
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
