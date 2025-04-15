import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import SubjectIcon from "@mui/icons-material/Subject";
// Nouvelles options d'icônes pour "Module"
import LayersIcon from "@mui/icons-material/Layers"; // Option 3
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

// Configuration
const drawerWidth = 230;

const openedMixin = (theme) => ({
  width: drawerWidth,
  background: "#2a1b3d",
  color: "#f0f0f0",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
  boxShadow: "3px 0 12px rgba(0, 0, 0, 0.25)",
  borderRight: "1px solid rgba(163, 124, 255, 0.1)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  background: "#2a1b3d",
  color: "#f0f0f0",
  overflowX: "hidden",
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
  boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  ...theme.mixins.toolbar,
  background: "#35254a",
  borderBottom: "1px solid rgba(163, 124, 255, 0.15)",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Vous pouvez remplacer l'icône dans cette ligne selon votre préférence
const eleveItems = [
  { text: "Dashboard", path: "/home", icon: <InboxIcon />, color: "#a37cff" },
  { text: "Élèves", path: "/gerer-eleve", icon: <GroupIcon />, color: "#4ecdc4" },
  { text: "Matières", path: "/gerer-matieres", icon: <SubjectIcon />, color: "#1dd1a1" },
  { text: "Module", path: "/gerer-modules", icon: <LayersIcon />, color: "#3498db" }, // Utilisation de LayersIcon
  { text: "Paramètres", path: "/settings", icon: <SettingsIcon />, color: "#ff6b6b" },
];
const enseignantItems = [
  { text: "Dashboard", path: "/home", icon: <InboxIcon />, color: "#a37cff" },
  { text: "Enseignants", path: "/gerer-enseignant", icon: <SchoolIcon />, color: "#f7b731" },
  { text: "Matières", path: "/gerer-matieres", icon: <SubjectIcon />, color: "#1dd1a1" },
  { text: "Module", path: "/gerer-modules", icon: <LayersIcon />, color: "#3498db" }, // Utilisation de LayersIcon
  { text: "Paramètres", path: "/settings", icon: <SettingsIcon />, color: "#ff6b6b" },
];
const menuItems = [
  { text: "Dashboard", path: "/home", icon: <InboxIcon />, color: "#a37cff" },
  { text: "Élèves", path: "/gerer-eleve", icon: <GroupIcon />, color: "#4ecdc4" },
  { text: "Enseignants", path: "/gerer-enseignant", icon: <SchoolIcon />, color: "#f7b731" },
  { text: "Matières", path: "/gerer-matieres", icon: <SubjectIcon />, color: "#1dd1a1" },
  { text: "Module", path: "/gerer-modules", icon: <LayersIcon />, color: "#3498db" }, // Utilisation de LayersIcon
  { text: "Paramètres", path: "/settings", icon: <SettingsIcon />, color: "#ff6b6b" },
];

export default function Sidenav({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  let items ;
  if (user?.role === "enseignant") {
    items = enseignantItems;
  }else if(user?.role === "eleve"){
    items = eleveItems;
  }else{
    items = menuItems;
  }
  
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open && (
            <Box
              sx={{
                pl: 1,
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#f0f0f0",
                letterSpacing: "1.2px",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            >
              {user?.role === "admin" ? "Admin Panel" : "User Panel"}
            </Box>
          )}
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              color: "#f0f0f0",
              borderRadius: "8px",
              padding: "6px",
              "&:hover": {
                color: "#a37cff",
                backgroundColor: "rgba(163, 124, 255, 0.15)",
                boxShadow: "0 2px 6px rgba(163, 124, 255, 0.3)",
              },
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: "rgba(163, 124, 255, 0.15)" }} />
        <List>
          {items.map((item) => (
            <Tooltip
              key={item.text}
              title={item.text}
              placement="right"
              disableHoverListener={open}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: item.color,
                    color: "#fff",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "0.95rem",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  },
                },
              }}
            >
              <ListItem disablePadding onClick={() => navigate(item.path)}>
                <ListItemButton
                  sx={{
                    py: 1.2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(163, 124, 255, 0.15)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.color,
                      minWidth: "50px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.15)",
                        filter: "brightness(1.2)",
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 500,
                        color: "#f0f0f0",
                        letterSpacing: "0.5px",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Divider sx={{ borderColor: "rgba(163, 124, 255, 0.15)" }} />
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            color: "#c0c0c0",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#a37cff",
              textShadow: "0 1px 3px rgba(163, 124, 255, 0.3)",
            },
          }}
        >
          © 2025 Leader-Learning.
        </Box>
      </Drawer>
    </Box>
  );
}