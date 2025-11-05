import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import PublicRoute from "./Components/PublicRoute/PublicRoute";
import ManageTeam from "./Components/OrganizerDashboard/TeamManage/ManageTeam";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import PublicAccess from "./Components/Participant/Home";
import PdfViewerModel from "./components/AdminDashboard/Proposal/PdfViewer";
import ResetPassword from "./Components/Login/ResetPassword";
import AdminLayout from "./Components/AdminDashboard/ManageAccount/Admin/AdminLayout";
import OrganizerLayout from "./Components/AdminDashboard/ManageAccount/Organizer/OrganizerLayout";
import OfficerLayout from "./Components/AdminDashboard/ManageAccount/Officer/OfficerLayout";
import ProposalTable from "./Components/AdminDashboard/Proposal/ProposalTable";
import Notification from "./Components/AdminDashboard/Notification/Notification";
import EventTable from "./Components/OrganizerDashboard/OrganizerComponents/Events/EventTable";
import ResourcesTable from "./Components/AdminDashboard/Resources/ResourcesTable";
import LGUTable from "./Components/AdminDashboard/ManageAccount/LGU/LGUTable";
import Calendar from "./Components/Calendar/Calendar";
import Login from "./Components/Login/Login"
import LGUResponseTable from "./Components/LGUDashboard/LGUComponent/LGUResponseTable";
import Register from "./Components/RegistrationComponents/RegistrationModalComponent";
import BarcodeScanner from "./Components/Scanner/ScannerComponent";
import Participant from "./Components/AdminDashboard/Participant/ParticipantTable"
import Report from "./Components/Reportsandcomments/reportscomment"
import ReportTable from "./Components/Reportsandcomments/ReportTable"
import Setting from "./Components/Setting/SettingLayout"
import Feedback from "./Components/Reportsandcomments/ReportTable"
function App() {
    const router = createBrowserRouter([
        {
            element: <PublicRoute />,
            children: [
                {
                    path: "/Public-Access",
                    element: <PublicAccess />,
                },
                {
                    path: "/Login",
                    element: <Login/>,
                },
                {
                    path: "/reset-password/:token",
                    element: <ResetPassword />,
                },
                {
                    path: "/registerEvent/:id",
                    element: <Register />,
                },
                {
                    path: "/Scanner",
                    element: <BarcodeScanner />,
                },{
                    path: "/review/:id",
                    element: <Report/>,
                },
                {
                    path: "/",
                    element: <Navigate to="/login" />,
                },
            ],
        },

        {
            element: <PrivateRoute />,
            children: [
                {
                    path: "/dashboard", // change root of authenticated layout
                    element: <Layout />,
                    children: [
                        {
                            index: true,
                            element: <DashboardPage />,
                        },
                        {
                            path: "/dashboard/lgu",
                            element: <LGUTable />,
                        },
                        {
                            path: "reports",
                            element:<ReportTable/>,
                        },
                        {
                            path: "pdf-viewer/:fileId",
                            element: <PdfViewerModel />,
                        },
                        {
                            path: "/dashboard/proposal",
                            element: <ProposalTable />,
                        },
                        {
                            path: "/dashboard/events",
                            element: <EventTable />,
                        },
                        {
                            path: "/dashboard/resources",
                            element: <ResourcesTable />,
                        },
                        {
                            path: "/dashboard/notification",
                            element: <Notification />,
                        },
                        {
                            path: "/dashboard/admin",
                            element: <AdminLayout />,
                        },
                        {
                            path: "/dashboard/officer",
                            element: <OfficerLayout />,
                        },
                        {
                            path: "/dashboard/organizer",
                            element: <OrganizerLayout />,
                        },
                        {
                            path: "/dashboard/manage-team",
                            element: <ManageTeam />,
                        },
                        {
                            path: "/dashboard/participants",
                            element: <Participant/>,
                        },
                        {
                            path: "/dashboard/Calendar",
                            element: <Calendar />,
                        },
                        {
                            path: "/dashboard/lgu-response",
                            element: <LGUResponseTable />,
                        },
                         {
                            path: "/dashboard/settings",
                            element: <Setting/>,
                        },
                        {
                            path: "/dashboard/Feedback",
                            element: <Feedback/>,
                        },
            
                    ],
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;