import BlogManagementModule from "@/components/modules/BlogManagement";
import HomepageClubsListContainer from "@/components/modules/Clubs/HomepageClubsListContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextTeam | Câu lạc bộ",
};

function Blog() {
  return <BlogManagementModule />;
}

export default Blog;
