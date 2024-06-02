import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupModal = ({ setismembersModalOpen, selectedGroup  , setUserInGroup , userInfo}) => {
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupAdminId, setGroupAdminId] = useState(null);

  const groupMemberRemoveHandler = async (e, memberId) => {
    try {
      e.preventDefault();
      const data={
        groupid: selectedGroup,
        userid: memberId
      }
      //console.log(data);
      const response = await axios.post("http://54.196.175.126/deleteuserfromgroup", data );
      //console.log(response)
      if (response){
        setismembersModalOpen(false)
        //setUserInGroup(false)
      }
    } catch (error) {
      console.error("Error removing group member:", error);
    }
  }; 

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await axios.post(
          "http://54.196.175.126/getalluserofgroup",
          { groupid: selectedGroup }
        );
        setGroupMembers(response.data.allUsers);
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
    };

    const getGroupAdminId = async () => {
      try {
        const response = await axios.post(
          "http://54.196.175.126/groupadminid",
          { groupid: selectedGroup }
        );
        setGroupAdminId(response.data.AdminId);
      } catch (error) {
        console.error("Error fetching group admin ID:", error);
      }
    };

    getGroupAdminId();
    fetchGroupMembers();
  }, [selectedGroup]);

  return (
    <div
      id="default-modal"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50"
      aria-hidden="true"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Group Members
            </h3>
            <button
              type="button"
              onClick={() => setismembersModalOpen(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            {groupMembers.length > 0 ? (
              groupMembers.map((member) => (
                <div key={member.id}>
                  {groupAdminId === member.id && (
                    <span className="text-lime-500">Group Admin</span>
                  )}
                  <div className="flex items-center justify-center p-2 bg-gray-100 rounded-md dark:bg-gray-800">
                    <span className="text-gray-900 dark:text-white text-center">
                      {member.name}
                    </span>
                  </div>
                  {groupAdminId !== member.id && userInfo.id == groupAdminId&& (
                      <button
                        type="button"
                        onClick={(e) => groupMemberRemoveHandler(e, member.id)}
                        className="flex justify-center items-center p-2 w-full bg-red-500 mt-2 rounded text-stone-50"
                      >
                        Remove
                      </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-900 dark:text-white text-center">
                No members in this group.
              </div>
            )}
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              type="button"
              onClick={() => setismembersModalOpen(false)}
              className="py-2.5 px-5 text-sm ml-auto font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
