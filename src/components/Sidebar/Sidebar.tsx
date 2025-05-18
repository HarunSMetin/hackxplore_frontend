import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Toolbar,
  Box,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const drawerWidth = 80;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Map", icon: <MapIcon />, path: "/map" },
  { label: "Trucks", icon: <LocalShippingIcon />, path: "/trucks" },
  { label: "Admin", icon: <AdminPanelSettingsIcon />, path: "/admin" },
  { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "rgba(35,38,47,0.85)",
          backdropFilter: "blur(8px)",
          borderRight: "1px solid #23262F",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.label}
              disablePadding
              sx={{ justifyContent: "center", mb: 1 }}
            >
              <ListItemButton
                sx={{ justifyContent: "center" }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon sx={{ color: "primary.main", minWidth: 0 }}>
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
