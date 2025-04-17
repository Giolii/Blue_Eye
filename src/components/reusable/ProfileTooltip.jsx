const ProfileTooltip = ({ user }) => {
  return (
    <div
      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap
        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg"
    >
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      <div className="flex items-start gap-3">
        <div className="rounded-full overflow-hidden border border-gray-500 bg-gray-700 w-12 h-12 flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            src={user.avatar}
            alt={`${user.username}'s avatar`}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-lg font-medium leading-tight">{user.username}</p>
          <p className="text-xs text-gray-300">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTooltip;
