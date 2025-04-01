import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <Navbar />
      <div className="max-w-4xl text-center p-10">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg">
          This is a simple movie search app built using React and Vite. 
          You can search for movies and see details about them.
        </p>
      </div>
    </div>
  );
}

export default About;
