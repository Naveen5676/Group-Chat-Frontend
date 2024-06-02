import React, { useRef, useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import GroupModal from "./GroupModal";
import MembersModal from "./MembersModal";
import { io } from "socket.io-client";
import attachedImage from "./attached.png";

function Chat() {
  const messageref = useRef();
  const fileref = useRef();
  const token = localStorage.getItem("userid");
  const [latestMessages, setLatestMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ismembersModalOpen, setismembersModalOpen] = useState(false);
  const [grouplist, setgrouplist] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null);
  const [selectedGroupMembersCount, setSelectedGroupMembersCount] =
    useState(null);
  const [responsemessagelength, setResponseMessageLength] = useState(false);
  const [useringroup, setUserInGroup] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [publicChat, setPublicChat] = useState(true); // Flag for public chat

  const socket = io("http://54.196.175.126:5000");

  useEffect(() => {
    if (publicChat) {
      socket.emit("joinPublic");
      fetchPublicData();
    } else if (selectedGroup) {
      socket.emit("joinGroup", selectedGroup);
      fetchData(selectedGroup);
    }
    getGroupList();
  }, [publicChat, selectedGroup]);

  // Function to handle group message data
  const handleGroupMessageData = (messages) => {
    console.log("group messages", messages);
    if (messages.length > 0) {
      setLatestMessages(messages);
      setResponseMessageLength(true);
    } else {
      setResponseMessageLength(false);
    }
  };

  // Function to handle public message data
  const handlePublicMessageData = (messages) => {
    console.log("public messages", messages);
    if (messages.length > 0) {
      setLatestMessages(messages);
      setResponseMessageLength(true);
    } else {
      setResponseMessageLength(false);
    }
  };

  useEffect(() => {
    if (publicChat) {
      socket.emit("joinPublic");
      fetchPublicData();
    } else if (selectedGroup) {
      socket.emit("joinGroup", selectedGroup);
      fetchData(selectedGroup);
    }
    getGroupList();

    // Attach socket listeners
    socket.on("groupmessagedata", handleGroupMessageData);
    socket.on("publicmessagedata", handlePublicMessageData);

    // Cleanup on unmount
    return () => {
      socket.off("groupmessagedata", handleGroupMessageData);
      socket.off("publicmessagedata", handlePublicMessageData);
    };
  }, [publicChat, selectedGroup]);

  async function membersmodalHandler() {
    setismembersModalOpen(true);
  }

  async function joingroupHandler(e) {
    e.preventDefault();
    try {
      const data = {
        groupid: selectedGroup,
      };
      const response = await axios.post(
        "http://54.196.175.126/joingroup",
        data,
        { headers: { Authorization: token } }
      );

      if (response.data.message === "Successfully joined group") {
        alert("Joined group successfully");
        setUserInGroup(true);
        fetchData(selectedGroup); // Fetch messages after joining the group
        fetchGroupMemberCount(selectedGroup); // Fetch group members count
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchGroupMemberCount(groupid) {
    try {
      const data = { groupid: groupid };
      const response = await axios.post(
        "http://54.196.175.126/checkuserpresentingroup",
        data,
        { headers: { Authorization: token } }
      );
      setSelectedGroupMembersCount(response.data.totalgroupmembers);
      setUserInGroup(response.data.inGroup); // Update user in group status
    } catch (error) {
      console.error("Error fetching group member count:", error);
    }
  }

  async function groupchangeHandler(groupid, e, groupname) {
    e.preventDefault();
    setSelectedGroup(groupid);
    setSelectedGroupName(groupname);
    setPublicChat(false);

    const data = {
      groupid: groupid,
    };
    try {
      const userpresentingroup = await axios.post(
        "http://54.196.175.126/checkuserpresentingroup",
        data,
        { headers: { Authorization: token } }
      );
      setUserInGroup(userpresentingroup.data.inGroup);
      setSelectedGroupMembersCount(userpresentingroup.data.totalgroupmembers);
      setUserInfo(userpresentingroup.data.userinfo);
    } catch (error) {
      console.error("Error checking user in group:", error);
    }
  }

  async function getGroupList() {
    try {
      const response = await axios.get("http://54.196.175.126/getgrouplist");
      setgrouplist(response.data);
    } catch (error) {
      console.error("Error fetching group list:", error);
    }
  }

  async function fetchData(groupid) {
    try {
      const latestMessageId = 0; // Fetch all messages for the group
      socket.emit("getChats", latestMessageId, groupid);
      socket.on("groupmessagedata", handleGroupMessageData);
    } catch (error) {
      console.log("fetchData error", error);
    }
  }

  async function fetchPublicData() {
    try {
      const latestMessageId = 0; // Fetch all public messages
      socket.emit("getChats", latestMessageId, 0);
      socket.on("publicmessagedata", handlePublicMessageData);
    } catch (error) {
      console.log("fetchPublicData error", error);
    }
  }

  async function dataHandler(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("message", messageref.current.value);
    formData.append("file", fileref.current.files[0]);
    formData.append("groupid", selectedGroup);

    try {
      const response = await axios.post(
        `http://54.196.175.126/sendchat`,
        formData,
        { headers: { Authorization: token } }
      );

      if (response) {
        alert("Data Sent to Database");
        if (publicChat) {
          fetchPublicData();
        } else {
          fetchData(selectedGroup);
        }
        messageref.current.value = "";
        fileref.current.value = null;
      }
    } catch (error) {
      console.log("error sending data ", error);
    }
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-cyan-400">
      <h1 className="text-center text-3xl">Chat App</h1>
      </div>
      <div className="flex-grow flex">
        <div className="w-1/4 bg-gray-200 p-4">
          {userInfo && userInfo.name && (
            <span>User Name : {userInfo.name} </span>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="block mb-2 text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
            type="button"
          >
            Create Group
          </button>
          <h2 className="text-xl text-center">Groups List</h2>
          {grouplist.length > 0 && (
            <ul className="mt-2">
              {grouplist.map((data, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    groupchangeHandler(data.groupid, e, data.name);
                  }}
                  className="cursor-pointer text-center hover:bg-gray-500 p-2 rounded"
                >
                  {data.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {useringroup ? (
          <div className="flex-grow p-4">
            {selectedGroup && (
              <div className="bg-gray-500 p-4 flex flex-row">
                <h2 className="text-xl text-start">
                  Group Name: {selectedGroupName}
                </h2>
                <button
                  onClick={membersmodalHandler}
                  className="ml-auto text-xl"
                >
                  Total Members: {selectedGroupMembersCount}
                </button>
              </div>
            )}
            {responsemessagelength ? (
              <div>
                {latestMessages.length > 0 &&
                  latestMessages.map((result, index) => (
                    <div key={index}>
                      id{result.userAuthDatumId} : {result.message}
                      {result.fileurl && (
                        <a
                          href={result.fileurl}
                          target="_blank"
                          className="ml-2 text-blue-600"
                        >
                          {result.filename}
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div>
                <h2 className="text-xl text-center">No messages yet</h2>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-grow items-center justify-center">
            <div className="flex flex-col items-center justify-center border p-4 bg-gray-200">
              <p>To join this group click below</p>
              <button
                onClick={joingroupHandler}
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Join Group
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-cyan-400 px-4 py-5 border-2 flex justify-center items-center">
        <form
          className="flex"
          onSubmit={dataHandler}
          encType="multipart/form-data"
        >
          <label htmlFor="file-input" className="cursor-pointer">
            <img src={attachedImage} alt="attached" className="w-8 h-8" />
          </label>
          <input
            type="text"
            ref={messageref}
            // required
            className="border-2 border-slate-800 mr-2"
          />
          <input type="file" ref={fileref} id="file-input" className="hidden" />

          <button type="submit" className="bg-zinc-400 px-5 py-1">
            Send
          </button>
        </form>
      </div>
      {isModalOpen && (
        <GroupModal
          setIsModalOpen={setIsModalOpen}
          getGroupList={getGroupList}
        />
      )}
      {ismembersModalOpen && (
        <MembersModal
          setismembersModalOpen={setismembersModalOpen}
          selectedGroup={selectedGroup}
          setUserInGroup={setUserInGroup}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}

export default Chat;
