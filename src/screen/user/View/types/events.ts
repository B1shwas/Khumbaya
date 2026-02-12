export type EventStatus = "Planning" | "Confirmed" | "Completed";
export type EventTab = "myEvents" | "invited";

export interface SubEvent {
  id: string;
  name: string;
  icon: string;
  date: string;
  time: string;
  activitiesCount: number;
  budget: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  status: EventStatus;
  isPast: boolean;
  isMyEvent: boolean;
  subEvents?: SubEvent[];
}

export const MOCK_SUB_EVENTS: SubEvent[] = [
  {
    id: "sangeet",
    name: "Sangeet",
    icon: "musical-notes",
    date: "Oct 24, 2023",
    time: "6:00 PM",
    activitiesCount: 8,
    budget: "$2,500",
  },
  {
    id: "mehendi",
    name: "Mehendi",
    icon: "color-filter",
    date: "Oct 25, 2023",
    time: "2:00 PM",
    activitiesCount: 6,
    budget: "$800",
  },
  {
    id: "haldi",
    name: "Haldi",
    icon: "water",
    date: "Oct 26, 2023",
    time: "10:00 AM",
    activitiesCount: 5,
    budget: "$500",
  },
];

export const EVENTS_DATA: Event[] = [
  {
    id: "1",
    title: "Sarah & Mike's Wedding",
    date: "Oct 24, 2023",
    time: "5:00 PM",
    location: "Grand Plaza Hotel",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMGBAVSA0a2mbV1NAsUQzu2bct2K06QsiZ1jLIpIf7nbUcD0SDuTMc-z75hROFlu_LFYS6GfeT0IqRnm7AbLiKsfERuzOvTIpNCDlKtTOcXYihWGijl5lpv6FUuJYne95hB_oQ_nxA-dIl28E1klx3juyud1wdRFijk9m43KdAbhRH-Lce5awx3x0UgGnkiFS7pGORCgl84OWwOA9D5zVEiQmLn-qp6adJQhSWlzYgKW5GpmgN2XlVRKLIC5jv2n1SqnX__0gkXGo",
    status: "Planning",
    isPast: false,
    isMyEvent: true,
    subEvents: MOCK_SUB_EVENTS,
  },
  {
    id: "2",
    title: "Diwali Celebration",
    date: "Nov 12, 2023",
    time: "7:00 PM",
    location: "Community Center",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoqHk60jIeSNZ9ki1c8iJtQhNgAylhPNie7B-e6RbVhqxqPZYWqYOStnWl2heFJMQW4km9uazp2AJ27FMETIhQQO3tXxYSIvbPNLiMuyf2dg0b3qT3v_GGw5YsO8M3pcj5Bnk0kNmcSQKT1p6x0bsxOFgm0JL10HY5_xet3NtTFkdXUpZlZid6xWZ7LqikDKmn0bLoVzit5hQKLe7VmvXCaa50hemlczbPWpDQbXcqd7R368vilNmPfa2ysrPk64t5Wga7Wgb-EVU",
    status: "Confirmed",
    isPast: false,
    isMyEvent: true,
  },
  {
    id: "3",
    title: "Annual Gala Dinner",
    date: "Dec 15, 2022",
    time: "6:30 PM",
    location: "City Convention Hall",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApbhlzAVy4OJVcYMZ4izXUlnKPSNe70nYIazGktsGplBpkgzEzpvxp_qgIiF3dn8QLXQ1ADctibRDxZ_8gdSpJtPeEoAzmBa0mHWTHfuzG_-R1aDiqm_BFUf7Q3xk-cIN9jnmVd3yZIPYwSMQ_Mu4phO1tDt1Z-TSTdGCpvwYmq3-Q9FRAq6bw6rkqiEBN4F029JIYHOxmHinCw-RP9-524nQVGQFR9CRcag0PgTHdiwqETf0l_HGG1IVwJVdDlPIb-Lqrd3JnXWk",
    status: "Completed",
    isPast: true,
    isMyEvent: true,
  },
  {
    id: "4",
    title: "Summer Music Fest",
    date: "Jul 10, 2022",
    time: "2:00 PM",
    location: "Riverside Park",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARGMTc7YD75O5-P1JXaqRK-kzu8vG4dIq7cAWSf3T_MtObQL1wDay2EjrgmOhEisjwDrxbgUi5CmmuPeBpNY8oTzyqjiQYIfhoMuhQ4alM838I-CHqYkWS_cPTJX3q8wMUv09PvLSFpA12g4XHRnHkHjl2GhsUzvy9UqCcZCecd_vx_3teq2dxTkkxf581tF1IXSMceXsU8alw80NOAhNnnzmeKmprOew-lXzEx3_2-LLgMplSZ80ITS0ryusXkdprVSAYOc0Y5Mc",
    status: "Completed",
    isPast: true,
    isMyEvent: false,
  },
  {
    id: "5",
    title: "Friend's Birthday Bash",
    date: "Mar 15, 2024",
    time: "8:00 PM",
    location: "Rooftop Lounge",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM",
    status: "Confirmed",
    isPast: false,
    isMyEvent: false,
  },
];

export const TABS: EventTab[] = ["myEvents", "invited"];
