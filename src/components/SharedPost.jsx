import { Link } from "react-router-dom";

const SharedPost = ({ post }) => {
  return (
    <div className="border border-gray-400 p-2 rounded-xl">
      <div className="flex flex-col ">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-cyan-900 font-bold group relative overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={post.user.avatar}
              alt="Avatar"
            />
          </div>
          <div className="flex-1">
            {/* Post header */}
            <div className="flex items-center justify-between mb-1 ">
              <div className="flex flex-col">
                <Link
                  className="font-semibold text-amber-50"
                  to={`/users/${post.userId}`}
                >
                  {post.user.name || post.user.username || "Unknown User"}
                </Link>
                <span className="text-amber-50/50 text-xs">
                  @{post.user.username}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-amber-50 whitespace-pre-wrap break-words p-2 text-center">
            {post.content}
          </div>
          {post.imageUrl && (
            <div className="bg-gray-50 flex justify-center  border border-gray-400 rounded-xl overflow-hidden max-w-md">
              <img src={post.imageUrl} alt="" />
            </div>
          )}
          {/* <span className="text-amber-100/50 text-xs flex items-center p-1">
            {new Date(post.createdAt).toLocaleDateString()}
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default SharedPost;
