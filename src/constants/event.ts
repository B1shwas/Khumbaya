export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  role: EventRole;
  status: EventTab;
}

export type EventRole = "Vendor" | "Organizer" | "Guest";
export type EventTab = "upcoming" | "invited" | "completed";

export const eventsData: Event[] = [
  {
    id: "1",
    title: "Sarah & Mike's Wedding",
    date: "Oct 24, 2023",
    time: "5:00 PM",
    location: "Grand Plaza Hotel",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMGBAVSA0a2mbV1NAsUQzu2bct2K06QsiZ1jLIpIf7nbUcD0SDuTMc-z75hROFlu_LFYS6GfeT0IqRnm7AbLiKsfERuzOvTIpNCDlKtTOcXYihWGijl5lpv6FUuJYne95hB_oQ_nxA-dIl28E1klx3juyud1wdRFijk9m43KdAbhRH-Lce5awx3x0UgGnkiFS7pGORCgl84OWwOA9D5zVEiQmLn-qp6adJQhSWlzYgKW5GpmgN2XlVRKLIC5jv2n1SqnX__0gkXGo",
    role: "Organizer",
    status: "upcoming",
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
    role: "Guest",
    status: "upcoming",
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
    role: "Vendor",
    status: "completed",
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
    role: "Vendor",
    status: "invited",
  },
  {
    id: "5",
    title: "Summer Music Fest",
    date: "Jul 10, 2022",
    time: "2:00 PM",
    location: "Riverside Park",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARGMTc7YD75O5-P1JXaqRK-kzu8vG4dIq7cAWSf3T_MtObQL1wDay2EjrgmOhEisjwDrxbgUi5CmmuPeBpNY8oTzyqjiQYIfhoMuhQ4alM838I-CHqYkWS_cPTJX3q8wMUv09PvLSFpA12g4XHRnHkHjl2GhsUzvy9UqCcZCecd_vx_3teq2dxTkkxf581tF1IXSMceXsU8alw80NOAhNnnzmeKmprOew-lXzEx3_2-LLgMplSZ80ITS0ryusXkdprVSAYOc0Y5Mc",
    role: "Guest",
    status: "invited",
  },
];
