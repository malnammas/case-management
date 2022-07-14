import React, { useEffect, useState, useMemo } from "react";
import "./UsersList.scss";
import { DataFormatter } from "../../../Helpers/DataFormatter";
import Loading from "../../../Components/Loading/Loading";
import TableTemplate from "../../../Components/Table/TableTemplate";
import { UsersApi } from "../../../Api/AxiosApi";
import { IoTrashOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { pageTitleCreator } from "../../../Redux/Actions/index";
import toast from "react-hot-toast";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const router = useNavigate();
  const dispatch = useDispatch();

  const filters = ["User ID", "Name", "Email", "Role", "Phone"];
  const columns = useMemo(() => [
    {
      name: "ID",
      sortable: true,
      selector: (row) => row.userId,
    },
    {
      name: "Full Name",
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Username",
      sortable: true,
      selector: (row) => row.username,
    },
    {
      name: "Phone",
      sortable: true,
      selector: (row) => row.phone,
    },
    {
      name: "Email",
      sortable: true,
      selector: (row) => row.email,
    },
    {
      name: "Role",
      sortable: true,
      selector: (row) => row.role,
    },
    {
      cell: (row) => (
        <div className="table-icons-container">
          <BiEdit
            className="edit-icon-style"
            onClick={(e) => handleButtonClick(e, row)}
          />
          <IoTrashOutline
            className="delete-icon-style"
            onClick={(e) => handleDelete(e, row)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  const handleDelete = async (e, row) => {
    try {
      await UsersApi.deleteUser(row.userId);
      toast.success("User Deleted Successfully");
      getTableData();
    } catch (error) {}
  };

  const handleButtonClick = (e, row) => {
    router("/AddUser", { state: row });
  };

  const getTableData = async () => {
    try {
      setIsLoading(true);
      const res = await UsersApi.getUsers();
      const flattenedData = res.data.map((item) => {
        const editedRow = {
          ...item,
          userId: DataFormatter(item.userID),
          name: DataFormatter(item.name),
          username: DataFormatter(item.username),
          email: DataFormatter(item.email),
          phone: DataFormatter(item.phone),
          role: DataFormatter(item.role),
        };
        return editedRow;
      });
      setUsers(flattenedData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  return (
    <div className="users-container">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="btns-container">
            <Button
              className="primary-btn-style"
              onClick={() => {
                router("/AddUser", { replace: true });
                dispatch(pageTitleCreator.change({ title: "Add New User" }));
              }}
            >
              Add User
            </Button>
            {/* <Button className="danger-btn-style"> Delete Users</Button> */}
          </div>
          <TableTemplate
            searchChoices={filters}
            columns={columns}
            data={users}
            multiSelection
          />
        </>
      )}
    </div>
  );
};

export default UsersList;
