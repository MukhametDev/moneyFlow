// components/PrivateRoute.js
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import store from "../../store/authStore";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ children }) => {
    return store.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
});

export default PrivateRoute;
