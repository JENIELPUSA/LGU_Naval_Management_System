import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SocketListener from "./Components/socket/SocketListener.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AxiosInterceptor from "./Components/AxiosInterceptor.jsx";
import { AdminDisplayProvider } from "./contexts/AdminContext/AdminContext.jsx";
import { OrganizerDisplayProvider } from "./contexts/OrganizerContext/OrganizerContext.jsx";
import { OfficerDisplayProvider } from "./contexts/OfficerContext/OfficerContext.jsx";
import { ProposalDisplayProvider } from "./contexts/ProposalContext/ProposalContext.jsx";
import { EventDisplayProvider } from "./contexts/EventContext/EventContext.jsx";
import { ResourcesDisplayProvider } from "./contexts/ResourcesContext/ResourcesContext.jsx";
import { NotificationDisplayProvider } from "./contexts/NotificationContext/NotificationContext.jsx";
import { TeamDisplayProvider } from "./contexts/TeamContext/TeamContext.jsx";
import { LguDisplayProvider } from "./contexts/LguContext/LguContext.jsx";
import { LGUResponsiseProvider } from "./contexts/LGUResponseContext/LGUResponseContext.jsx";
import { ParticipantDisplayProvider } from "./contexts/ParticipantContext/ParticipantContext.jsx";
import { ReportDisplayProvider } from "./contexts/ReportContext/ReportContext.jsx";
import { PersonelDisplayProvider } from "./contexts/PersonelContext/PersonelContext.jsx";
import { ContactDisplayProvider } from "./contexts/ContactContext/ContactInfoContext.jsx";
import { AccessibilityProvider } from "./Components/Participant/NavHeader";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AccessibilityProvider>
            <AuthProvider>
                <ContactDisplayProvider>
                    <PersonelDisplayProvider>
                        <ReportDisplayProvider>
                            <ParticipantDisplayProvider>
                                <LGUResponsiseProvider>
                                    <LguDisplayProvider>
                                        <TeamDisplayProvider>
                                            <NotificationDisplayProvider>
                                                <ResourcesDisplayProvider>
                                                    <EventDisplayProvider>
                                                        <ProposalDisplayProvider>
                                                            <OfficerDisplayProvider>
                                                                <OrganizerDisplayProvider>
                                                                    <AdminDisplayProvider>
                                                                        <SocketListener />
                                                                        <App />
                                                                        <AxiosInterceptor />
                                                                    </AdminDisplayProvider>
                                                                </OrganizerDisplayProvider>
                                                            </OfficerDisplayProvider>
                                                        </ProposalDisplayProvider>
                                                    </EventDisplayProvider>
                                                </ResourcesDisplayProvider>
                                            </NotificationDisplayProvider>
                                        </TeamDisplayProvider>
                                    </LguDisplayProvider>
                                </LGUResponsiseProvider>
                            </ParticipantDisplayProvider>
                        </ReportDisplayProvider>
                    </PersonelDisplayProvider>
                </ContactDisplayProvider>
            </AuthProvider>
        </AccessibilityProvider>
    </StrictMode>,
);
