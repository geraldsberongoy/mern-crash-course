import Card from "../components/Card/Card";

const HomePage = () => {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
