import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Grid,
  Chip,
  Container,
  Tab,
  Tabs,
  Backdrop,
  Card,
  CardContent,
  Switch,
  styled as muiStyled,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShieldIcon from "@mui/icons-material/Shield";

// Palette de couleurs
const colors = {
  primary: { main: "#3B82F6", light: "#60A5FA", dark: "#2563EB", contrastText: "#FFFFFF" },
  secondary: { main: "#10B981", light: "#34D399", dark: "#059669", contrastText: "#FFFFFF" },
  accent: { main: "#8B5CF6", light: "#A78BFA", dark: "#7C3AED", contrastText: "#FFFFFF" },
  background: {
    default: "#F9FAFB",
    paper: "#FFFFFF",
    dark: "#1F2937",
    card: "#F3F4F6",
    gradient: "linear-gradient(145deg, #EFF6FF 0%, #DBEAFE 100%)",
  },
  text: { primary: "#1F2937", secondary: "#4B5563", light: "#6B7280", white: "#FFFFFF" },
  border: "#E5E7EB",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
};

// Styles corrigés avec les dimensions du deuxième code
const PageContainer = styled(Container)(({ theme, isSidenavOpen }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  marginLeft: isSidenavOpen ? "235px" : "206px", // Augmentation : 215px -> 235px avec sidenav, 0 -> 20px sans sidenav
  width: isSidenavOpen ? "calc(100% - 230px)" : "calc(100% - 40px)", // Ajustement largeur pour cohérence
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 64px)",
  background: colors.background.default,
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
    width: "100%",
    padding: theme.spacing(2),
  },
}));

const ProfileBanner = styled(Box)(({ theme }) => ({
  height: "180px",
  borderRadius: "24px 24px 0 0",
  background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.accent.main})`,
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "50%",
    background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)",
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `5px solid ${colors.background.paper}`,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  position: "absolute",
  bottom: "-20px", // Changé de -75px à -50px pour remonter de 25px
  left: "50px",
  zIndex: 10,
  transition: "transform 0.3s ease",
  "&:hover": { transform: "scale(1.05)" },
  [theme.breakpoints.down("sm")]: {
    width: 100,
    height: 100,
    bottom: "-25px", // Ajusté de -50px à -25px sur mobile pour cohérence
    left: "20px",
  },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  borderRadius: "24px",
  overflow: "visible",
  background: "transparent",
  boxShadow: "none",
  marginBottom: theme.spacing(4),
}));

const ProfileBody = styled(Paper)(({ theme }) => ({
  borderRadius: "0 0 24px 24px",
  backgroundColor: colors.background.paper,
  paddingTop: theme.spacing(8),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
}));

const InfoHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: theme.spacing(0, 6, 2, 6),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
    padding: theme.spacing(0, 2, 2, 2),
  },
}));

const TabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    aria-labelledby={`profile-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: colors.text.primary,
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: colors.text.secondary,
  marginBottom: theme.spacing(0.5),
  fontSize: "0.9rem",
}));

const StyledTextField = muiStyled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    transition: "all 0.2s ease",
    backgroundColor: colors.background.card,
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: colors.primary.light },
    "&.Mui-focused fieldset": { borderColor: colors.primary.main, borderWidth: "1px" },
    "&.Mui-error fieldset": { borderColor: colors.error },
  },
  "& .MuiInputBase-input": { padding: "14px 16px" },
}));

const PasswordField = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  "& .MuiIconButton-root": {
    position: "absolute",
    right: theme.spacing(1),
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.text.light,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  textTransform: "none",
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": { boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)", transform: "translateY(-2px)" },
  "&:active": { transform: "translateY(0)" },
  "&:disabled": { opacity: 0.7 },
}));

const ChangePhotoButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: "5px",
  right: "5px",
  backgroundColor: colors.background.paper,
  color: colors.primary.main,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  "&:hover": { backgroundColor: colors.primary.light, color: colors.background.paper },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  height: "100%",
  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)" },
}));

// Composant principal
const Profile = ({ isSidenavOpen = false }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profileImage: "https://i.pravatar.cc/300?img=3",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    phone: "",
    location: "",
    role: "",
    twoFactorEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] } },
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vous devez être connecté.");

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur réseau.");
        }

        const result = await response.json();
        setUserInfo({
          name: result.name || "Utilisateur",
          email: result.email || "",
          profileImage: result.profileImage || "https://i.pravatar.cc/300?img=3",
          phone: result.phone || "",
          location: result.location || "",
          role: result.role || "",
          twoFactorEnabled: result.twoFactorEnabled || false,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setLastUpdate(
          result.lastUpdate
            ? new Date(result.lastUpdate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : null
        );
      } catch (error) {
        toast.error(error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (userInfo.newPassword) {
      if (!userInfo.currentPassword) newErrors.currentPassword = "Mot de passe actuel requis.";
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(userInfo.newPassword))
        newErrors.newPassword = "8 caractères min., 1 majuscule, 1 chiffre.";
      if (userInfo.newPassword !== userInfo.confirmPassword)
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    if (!userInfo.name) newErrors.name = "Le nom est requis.";
    if (!userInfo.email || !/\S+@\S+\.\S+/.test(userInfo.email)) newErrors.email = "Email invalide.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [userInfo]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleTwoFactorChange = useCallback((e) => {
    setUserInfo((prev) => ({ ...prev, twoFactorEnabled: e.target.checked }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 1 Mo.");
      return;
    }
    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserInfo((prev) => ({ ...prev, profileImage: reader.result }));
      setUploadingPhoto(false);
      toast.success("Photo mise à jour.");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vous devez être connecté.");

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour.");
      }

      const now = new Date();
      setLastUpdate(now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }));
      setUserInfo((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      toast.success("Profil mis à jour avec succès.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = useCallback((e, newValue) => setTabValue(newValue), []);

  if (loading) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: 9999, background: colors.background.gradient }} open>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <CircularProgress sx={{ color: colors.primary.main }} size={70} thickness={4} />
        </motion.div>
      </Backdrop>
    );
  }

  return (
    <PageContainer isSidenavOpen={isSidenavOpen}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <ProfileCard>
          <motion.div variants={itemVariants}>
            <ProfileBanner>
              <input
                accept="image/*"
                id="profile-image-upload"
                type="file"
                hidden
                onChange={handleImageUpload}
              />
              <ProfileAvatar src={userInfo.profileImage} alt={userInfo.name}>
                {uploadingPhoto && (
                  <CircularProgress
                    size={30}
                    sx={{ position: "absolute", top: "50%", left: "50%", mt: "-15px", ml: "-15px" }}
                  />
                )}
              </ProfileAvatar>
              <label htmlFor="profile-image-upload">
                <ChangePhotoButton aria-label="Changer la photo">
                  <CameraAltIcon />
                </ChangePhotoButton>
              </label>
            </ProfileBanner>
          </motion.div>

          <ProfileBody>
            <InfoHeader>
              <Box>
                <motion.div variants={itemVariants}>
                  <Typography variant="h4" fontWeight="700" color={colors.text.primary}>
                    {userInfo.name}
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography variant="body1" color={colors.text.secondary} display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" sx={{ color: colors.primary.main }} />
                    {userInfo.email}
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Chip
                      label={userInfo.role || "Non défini"}
                      size="small"
                      sx={{ bgcolor: `${colors.primary.main}15`, color: colors.primary.main, fontWeight: 600 }}
                    />
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
                      label="Compte vérifié"
                      size="small"
                      sx={{ bgcolor: `${colors.secondary.main}15`, color: colors.secondary.main, fontWeight: 600 }}
                    />
                  </Box>
                </motion.div>
              </Box>
              <motion.div variants={itemVariants}>
                <Box textAlign="right">
                  {lastUpdate && (
                    <Typography variant="body2" color={colors.text.light}>
                      Dernière mise à jour: <b>{lastUpdate}</b>
                    </Typography>
                  )}
                  <StyledButton
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={saving}
                    sx={{ mt: 1, background: colors.primary.main, color: colors.text.white }}
                  >
                    {saving ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sauvegarder"}
                  </StyledButton>
                </Box>
              </motion.div>
            </InfoHeader>

            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Onglets du profil"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    minHeight: "60px",
                    color: colors.text.secondary,
                    "&.Mui-selected": { color: colors.primary.main },
                  },
                  "& .MuiTabs-indicator": { backgroundColor: colors.primary.main, height: "3px" },
                }}
              >
                <Tab label="Informations" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Sécurité" icon={<SecurityIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            <form onSubmit={handleSubmit}>
              <TabPanel value={tabValue} index={0}>
                <FormSection>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <motion.div variants={itemVariants}>
                        <SectionTitle variant="h6">
                          <PersonIcon sx={{ color: colors.primary.main }} fontSize="small" />
                          Informations de base
                        </SectionTitle>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <FieldLabel>Nom complet</FieldLabel>
                            <StyledTextField
                              fullWidth
                              name="name"
                              value={userInfo.name}
                              onChange={handleChange}
                              error={!!errors.name}
                              helperText={errors.name}
                              required
                              variant="outlined"
                              placeholder="Votre nom"
                              InputProps={{ startAdornment: <PersonIcon sx={{ color: colors.text.light, mr: 1 }} /> }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FieldLabel>Adresse e-mail</FieldLabel>
                            <StyledTextField
                              fullWidth
                              name="email"
                              type="email"
                              value={userInfo.email}
                              onChange={handleChange}
                              error={!!errors.email}
                              helperText={errors.email}
                              required
                              variant="outlined"
                              placeholder="votre.email@exemple.com"
                              InputProps={{ startAdornment: <EmailIcon sx={{ color: colors.text.light, mr: 1 }} /> }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FieldLabel>Téléphone</FieldLabel>
                            <StyledTextField
                              fullWidth
                              name="phone"
                              value={userInfo.phone}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Votre numéro"
                              InputProps={{ startAdornment: <PhoneIcon sx={{ color: colors.text.light, mr: 1 }} /> }}
                            />
                          </Grid>
                        </Grid>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <motion.div variants={itemVariants}>
                        <SectionTitle variant="h6">
                          <AccountCircleIcon sx={{ color: colors.primary.main }} fontSize="small" />
                          Informations professionnelles
                        </SectionTitle>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <FieldLabel>Poste</FieldLabel>
                            <StyledTextField
                              fullWidth
                              name="role"
                              value={userInfo.role}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Votre poste"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FieldLabel>Localisation</FieldLabel>
                            <StyledTextField
                              fullWidth
                              name="location"
                              value={userInfo.location}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Ville, Pays"
                              InputProps={{
                                startAdornment: <LocationOnIcon sx={{ color: colors.text.light, mr: 1 }} />,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <InfoCard>
                              <CardContent>
                                <Typography variant="subtitle2" color={colors.text.secondary} fontWeight={600}>
                                  Statut du compte
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <ShieldIcon color="success" />
                                    <Typography variant="body2">Compte actif et vérifié</Typography>
                                  </Box>
                                  <Chip
                                    label="Actif"
                                    size="small"
                                    sx={{ bgcolor: colors.success, color: "white", fontWeight: 600 }}
                                  />
                                </Box>
                              </CardContent>
                            </InfoCard>
                          </Grid>
                        </Grid>
                      </motion.div>
                    </Grid>
                  </Grid>
                </FormSection>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <FormSection>
                  <motion.div variants={itemVariants}>
                    <SectionTitle variant="h6">
                      <LockIcon sx={{ color: colors.primary.main }} fontSize="small" />
                      Changer votre mot de passe
                    </SectionTitle>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <FieldLabel>Mot de passe actuel</FieldLabel>
                        <PasswordField>
                          <StyledTextField
                            fullWidth
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={userInfo.currentPassword}
                            onChange={handleChange}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword}
                            variant="outlined"
                            placeholder="●●●●●●●●"
                          />
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            aria-label="Afficher/Masquer mot de passe actuel"
                          >
                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </PasswordField>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FieldLabel>Nouveau mot de passe</FieldLabel>
                        <PasswordField>
                          <StyledTextField
                            fullWidth
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={userInfo.newPassword}
                            onChange={handleChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword || "8 caractères min., 1 majuscule, 1 chiffre"}
                            variant="outlined"
                            placeholder="●●●●●●●●"
                          />
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label="Afficher/Masquer nouveau mot de passe"
                          >
                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </PasswordField>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FieldLabel>Confirmer le mot de passe</FieldLabel>
                        <PasswordField>
                          <StyledTextField
                            fullWidth
                            name="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"}
                            value={userInfo.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            variant="outlined"
                            placeholder="●●●●●●●●"
                          />
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label="Afficher/Masquer confirmation mot de passe"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </PasswordField>
                      </Grid>
                    </Grid>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Box mt={4}>
                      <SectionTitle variant="h6">
                        <SecurityIcon sx={{ color: colors.primary.main }} fontSize="small" />
                        Sécurité du compte
                      </SectionTitle>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <InfoCard>
                            <CardContent>
                              <Typography variant="subtitle2" color={colors.text.secondary} fontWeight={600}>
                                Dernière connexion
                              </Typography>
                              <Divider sx={{ my: 1.5 }} />
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="body2">4 avril 2025, 09:45</Typography>
                                <Typography variant="body2" color={colors.text.light}>
                                  IP: 197.21.XX.XX
                                </Typography>
                              </Box>
                            </CardContent>
                          </InfoCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InfoCard>
                            <CardContent>
                              <Typography variant="subtitle2" color={colors.text.secondary} fontWeight={600}>
                                Authentification à deux facteurs
                              </Typography>
                              <Divider sx={{ my: 1.5 }} />
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="body2">Activer 2FA</Typography>
                                <Switch
                                  checked={userInfo.twoFactorEnabled}
                                  onChange={handleTwoFactorChange}
                                  color="primary"
                                  inputProps={{ "aria-label": "Activer/Désactiver 2FA" }}
                                />
                              </Box>
                            </CardContent>
                          </InfoCard>
                        </Grid>
                      </Grid>
                    </Box>
                  </motion.div>
                </FormSection>
              </TabPanel>
            </form>
          </ProfileBody>
        </ProfileCard>
      </motion.div>
    </PageContainer>
  );
};

export default Profile;