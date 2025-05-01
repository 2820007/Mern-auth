import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Contex/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-800 mt-20 px-4">
      <img
        className="w-36 h-36 rounded-full mb-6"
        src={assets.header_img}
        alt="User Avatar"
      />

      <h1 className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "Developer"}
        <img className="w-8 h-8" src={assets.hand_wave} alt="Wave Emoji" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>

      <p className="mb-8 max-w-md">
        Let's start with a quick product tour and we will have you up and
        running in no time.
      </p>

      <button className="border border-gray-500 rounded-full hover:bg-gray-100 px-8 py-2.5 transition-all">
        Get started
      </button>
    </div>
  );
};

export default Header;
