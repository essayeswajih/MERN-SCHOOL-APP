import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { Avatar, Tooltip } from "@mui/material";

// Style de l'AppBar
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(135deg, #2c1f3c 0%, #1a1326 100%)",
  color: "#ffffff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  borderBottom: "1px solid rgba(138, 92, 183, 0.2)",
}));

// Style de la barre de recherche
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(138, 92, 183, 0.3)",
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: "100%",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
  [theme.breakpoints.up("sm")]: {
    width: "auto",
    minWidth: "280px",
  },
  "&:focus-within": {
    minWidth: "320px",
    background: "rgba(255, 255, 255, 0.15)",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8a5cb7",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#ffffff",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "24ch",
    },
    "&:focus": {
      backgroundColor: "rgba(138, 92, 183, 0.1)",
      width: "28ch",
    },
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1rem",
    letterSpacing: "0.5px",
  },
}));

const StyledMenuIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "rgba(138, 92, 183, 0.2)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "2.2rem",
    color: "#ffffff",
  },
  "&:hover .MuiSvgIcon-root": {
    color: "#8a5cb7",
  },
}));

const PremiumIconButton = styled(IconButton)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    backgroundColor: "rgba(138, 92, 183, 0.2)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.8rem",
    color: "#ffffff",
  },
  "&:hover .MuiSvgIcon-root": {
    color: "#8a5cb7",
  },
  "& .MuiBadge-badge": {},
}));

export default function Navbar({ handleLogout, user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleSearchChange = (event) => {
    console.log("Recherche:", event.target.value);
    // Ici, vous pouvez ajouter une logique de recherche réelle (par exemple, appel API)
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          background: "linear-gradient(135deg, #2c1f3c 0%, #1a1326 100%)",
          color: "#ffffff",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
          borderRadius: "12px",
          border: "1px solid rgba(138, 92, 183, 0.3)",
          backdropFilter: "blur(10px)",
          "& .MuiMenuItem-root": {
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1rem",
            padding: "12px 24px",
            "&:hover": {
              backgroundColor: "rgba(138, 92, 183, 0.2)",
            },
          },
        },
      }}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
        Profil
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate("/account"); }}>
        Mon compte
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (typeof handleLogout === "function") {
            handleMenuClose();
            handleLogout();  // This will clear localStorage and redirect to /login
          } else {
            console.error("handleLogout n'est pas une fonction. Vérifiez les props.");
            // Fallback navigation if handleLogout fails
            localStorage.clear();  // Clear all localStorage items
            navigate("/login");
          }
        }}
      >
        Déconnexion
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          background: "linear-gradient(135deg, #2c1f3c 0%, #1a1326 100%)",
          color: "#ffffff",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
          borderRadius: "12px",
          border: "1px solid rgba(138, 92, 183, 0.3)",
          backdropFilter: "blur(10px)",
          "& .MuiMenuItem-root": {
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1rem",
            padding: "12px 24px",
            "&:hover": {
              backgroundColor: "rgba(138, 92, 183, 0.2)",
            },
          },
        },
      }}
    >
      <MenuItem>
        <PremiumIconButton size="large" aria-label="show 4 new mails">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </PremiumIconButton>
        <Typography variant="body2" sx={{ ml: 1, fontFamily: "'Montserrat', sans-serif" }}>
          Messages
        </Typography>
      </MenuItem>
      <MenuItem>
        <PremiumIconButton size="large" aria-label="show 17 new notifications">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </PremiumIconButton>
        <Typography variant="body2" sx={{ ml: 1, fontFamily: "'Montserrat', sans-serif" }}>
          Notifications
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <PremiumIconButton
          size="large"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
        >
          <Avatar
            src="https://i.pravatar.cc/40?img=3"
            sx={{ width: 32, height: 32, border: "2px solid #8a5cb7" }}
          />
        </PremiumIconButton>
        <Typography variant="body2" sx={{ ml: 1, fontFamily: "'Montserrat', sans-serif" }}>
          Profil
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ padding: "0 24px", minHeight: "72px" }}>
          <StyledMenuIconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </StyledMenuIconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "1.6rem",
              letterSpacing: "1.5px",
              color: "#ffffff",
              textTransform: "uppercase",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              display: { xs: "none", sm: "block" },
            }}
          >
            Leader Learning
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Rechercher…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "12px" }}>
            <Tooltip
              title="Messages"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#8a5cb7",
                    color: "#fff",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.9rem",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  },
                },
              }}
            >
              <PremiumIconButton size="large" aria-label="show 4 new mails">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </PremiumIconButton>
            </Tooltip>
            <Tooltip
              title="Notifications"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#8a5cb7",
                    color: "#fff",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.9rem",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  },
                },
              }}
            >
              <PremiumIconButton size="large" aria-label="show 17 new notifications">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </PremiumIconButton>
            </Tooltip>
            <Tooltip
              title="Profil"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#8a5cb7",
                    color: "#fff",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.9rem",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  },
                },
              }}
            >
              <PremiumIconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
              >
                <Avatar
                  src="https://i.pravatar.cc/40?img=3"
                  sx={{ width: 36, height: 36, border: "2px solid #8a5cb7" }}
                />
              </PremiumIconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <PremiumIconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
            >
              <MoreIcon />
            </PremiumIconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
