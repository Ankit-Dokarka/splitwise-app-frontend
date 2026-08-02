import {
  FiMail,
  FiPhone,
  FiUser,
  FiEdit2,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import getName from "../utils/getName";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm overflow-hidden">
        <div className="h-32 bg-linear-to-br from-(--color-primary) to-(--color-primary-hover) relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]"></div>
        </div>
        <div className="px-6 pb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-(--color-primary) text-(--color-surface) flex items-center justify-center text-3xl font-bold border-4 border-(--color-surface) -mt-12 shadow-lg shrink-0 z-10">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-(--color-text)">
              {getName(user)}
            </h2>
            <p className="text-sm text-(--color-text-muted) flex items-center justify-center md:justify-start gap-1.5 mt-1">
              <FiMail size={14} />
              {user?.email}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-(--color-surface) border border-(--color-border) text-(--color-text) hover:bg-(--color-bg) text-sm font-medium rounded-(--btn-radius) transition-colors shadow-sm w-full md:w-auto justify-center">
            <FiEdit2 size={14} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-(--color-text) mb-6">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--color-text)">
              First Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
              <input
                type="text"
                defaultValue="John"
                className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-3 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface) hover:border-(--color-text-muted)"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--color-text)">
              Last Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
              <input
                type="text"
                defaultValue="Doe"
                className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-3 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface) hover:border-(--color-text-muted)"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--color-text)">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
              <input
                type="email"
                value={user.email}
                className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-3 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface) hover:border-(--color-text-muted)"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--color-text)">
              Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-3 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface) hover:border-(--color-text-muted)"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-(--color-text)">
              Address
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
              <input
                type="text"
                defaultValue="123 Main St, Anytown, USA"
                className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-3 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface) hover:border-(--color-text-muted)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-surface) text-sm font-medium rounded-(--btn-radius) transition-colors shadow-sm">
            <FiCheck size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
