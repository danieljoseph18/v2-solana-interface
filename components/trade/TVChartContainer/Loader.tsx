import "./Loader.css";

const Loader = () => {
  return (
    <div className="w-full h-full min-h-[550px] relative flex flex-col bg-transparent  rounded-lg">
      <div className="bouncing-loader absolute inset-0 left-0 right-0">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
