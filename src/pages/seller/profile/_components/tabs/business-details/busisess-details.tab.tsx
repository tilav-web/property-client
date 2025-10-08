import YttSection from "./ytt-section";

export default function BusisessDetailsTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  return (
    <div>
      <YttSection handleSelectTab={handleSelectTab} />
    </div>
  );
}
