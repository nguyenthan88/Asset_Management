import { useRoutes } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import Login from './Pages/Login/Login';
import Missing from './Pages/Missing/Missing';
import RequireAuth from './Pages/RequireAuth/RequireAuth';
import Unauthorized from './Pages/Unauthorized/Unauthorized';
import EditUserPage from './Pages/User/EditUserPage';
import UserListPage from './Pages/User/UserListPage';
import CreateUserPage from './Pages/User/CreateUserPage';
import SideBar from './Components/Navbar/Sidebar';
import AssetListPage from './Pages/Asset/AssetListPage';
import FormDisabledDemo from './Pages/Assignment/CreateAssignment';
import EditAssetPage from './Pages/Asset/EditAssetPage';
import CreateAssetPage from './Pages/Asset/CreateAssetPage';
import AssignmentListPage from './Pages/Assignment/AssignmentList';
import ListRequestPage from './Pages/ListRequest/ListRequestPage';
import ReportPage from './Pages/Report/report';
import EditAssignment from './Pages/Assignment/EditAssignment';


const ROLES = {
  Staff: 'Staff',
  Admin: 'Admin',
};

const pathName = {
  home: '/',
  login: '/login',
  unauthorized: '/unauthorized',
};

export const AppRouter = () => {
  const elements = useRoutes([
    { path: pathName.login, element: <Login /> },
    { path: pathName.unauthorized, element: <Unauthorized /> },

    {
      element: <RequireAuth allowedRoles={[ROLES.Staff, ROLES.Admin]} />,
      children: [
        {
          path: '/home',
          element: (
            <SideBar>
              <HomePage />
            </SideBar>
          ),
        },
      ],
    },
    {
      element: <RequireAuth allowedRoles={[ROLES.Staff, ROLES.Admin]} />,
      children: [
        {
          path: '/',
          element: (
            <SideBar>
              <HomePage />
            </SideBar>
          ),
        },
      ],
    },

    {
      element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
      children: [
        {
          path: '/asset',
          element: (
            <SideBar>
              <AssetListPage />
            </SideBar>
          ),
        },
        {
          path: '/asset/edit/:slug',
          element: (
            <SideBar>
              <EditAssetPage title="Edit Asset" />
            </SideBar>
          ),
        },
        {
          path: '/asset/create',
          element: (
            <SideBar>
              <CreateAssetPage title="Create New Asset" />
            </SideBar>
          ),
        },
      ],
    },

    {
      element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
      children: [
        {
          path: '/assignment/create',
          element: (
            <SideBar>
              <FormDisabledDemo />
            </SideBar>
          ),
        },
        {
          path: '/assignment/edit/:id',
          element: (
            <SideBar>
              <EditAssignment />
            </SideBar>
          ),
        },
        {
          path: '/assignment',
          element: (
            <SideBar>
              <AssignmentListPage />
            </SideBar>
          ),
        },
      ],
    },

    {
      element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
      children: [
        {
          path: '/user',
          element: (
            <SideBar>
              <UserListPage />
            </SideBar>
          ),
        },
        {
          path: '/user/create',
          element: (
            <SideBar>
              <CreateUserPage title="Create New User" />
            </SideBar>
          ),
        },
        {
          path: '/user/edit/:slug',
          element: (
            <SideBar>
              <EditUserPage title="Edit User" />
            </SideBar>
          ),
        },
      ],
    },
    {
      element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
      children: [
        {
          path: '/request',
          element: (
            <SideBar>
              <ListRequestPage />
            </SideBar>
          ),
        },
      ],
    },
    {
      element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
      children: [
        {
          path: '/report',
          element: (
            <SideBar>
              <ReportPage />
            </SideBar>
          ),
        },
      ],
    },

    { path: '*', element: <Missing /> },
  ]);

  return elements;
};
