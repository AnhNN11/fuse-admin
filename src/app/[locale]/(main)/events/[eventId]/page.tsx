import EventDEtailModule from "@/components/modules/EventsManagement/EventDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextTeam | Thông tin sự kiện",
};

export default function EventDetailPage() {
  return <EventDEtailModule />;
}
