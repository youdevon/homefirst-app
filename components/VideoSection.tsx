import { getPublicVideoSection } from "@/lib/homepage-videos-data";
import VideoSectionClient from "@/components/VideoSectionClient";

export default async function VideoSection() {
  const section = await getPublicVideoSection();

  return <VideoSectionClient section={section} />;
}
