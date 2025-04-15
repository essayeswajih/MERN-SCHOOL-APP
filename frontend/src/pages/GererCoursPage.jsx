import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { Visibility, Delete, Search, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const styles = {
  content: {
    flexGrow: 1,
    width: "calc(100% - 230px)", // Pleine largeur moins la taille du Sidenav
    marginLeft: "230px", // Aligné avec le Sidenav
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centrage horizontal du contenu
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    pt: "80px", // Espace pour le Navbar fixe
  },
  header: {
    width: "100%",
    padding: { xs: "15px 20px", md: "20px 40px" },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    backgroundColor: "#fff",
    borderBottom: "2px solid #a37cff",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    borderRadius: "0 0 8px 8px",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  title: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    fontSize: { xs: "1.4rem", md: "1.8rem" },
    color: "#2a1b3d",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#a37cff",
    },
  },
  courseCount: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "0.85rem",
    color: "#666",
    backgroundColor: "rgba(163, 124, 255, 0.1)",
    padding: "4px 10px",
    borderRadius: "12px",
    border: "1px solid #a37cff",
  },
  searchField: {
    width: { xs: "100%", sm: "320px", md: "400px" }, // Plus large en plein écran
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#a37cff",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#8c5eff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#a37cff",
        boxShadow: "0 0 6px rgba(163, 124, 255, 0.4)",
      },
    },
  },
  addButton: {
    backgroundColor: "#4ecdc4",
    color: "#fff",
    padding: "10px 24px", // Légèrement plus grand
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(78, 205, 196, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#45b7d1",
      boxShadow: "0 4px 12px rgba(78, 205, 196, 0.5)",
      transform: "translateY(-2px)",
    },
  },
  tableContainer: {
    width: "100%", // Pleine largeur
    backgroundColor: "#fff",
    border: "1px solid rgba(163, 124, 255, 0.2)",
    borderRadius: "8px",
    overflow: "auto",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    marginTop: "20px",
    mx: "20px", // Marges horizontales symétriques
  },
  tableHeader: {
    backgroundColor: "#f9f9f9",
    "& th": {
      fontFamily: "'Roboto', sans-serif",
      fontWeight: 600,
      color: "#2a1b3d",
      borderBottom: "2px solid rgba(163, 124, 255, 0.3)",
      padding: "16px", // Plus d’espace
      textAlign: "left",
      fontSize: "0.95rem",
    },
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "rgba(163, 124, 255, 0.05)",
    },
    "& td": {
      padding: "16px",
      borderBottom: "1px solid #eee",
      verticalAlign: "middle",
      fontSize: "0.9rem",
      fontFamily: "'Roboto', sans-serif",
      color: "#333",
    },
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
  },
  viewButton: {
    color: "#a37cff",
    "&:hover": {
      backgroundColor: "rgba(163, 124, 255, 0.1)",
      borderRadius: "50%",
    },
  },
  deleteButton: {
    color: "#ff6b6b",
    "&:hover": {
      backgroundColor: "rgba(255, 107, 107, 0.1)",
      borderRadius: "50%",
    },
  },
  pagination: {
    marginTop: "30px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    "& .MuiPaginationItem-root": {
      fontFamily: "'Roboto', sans-serif",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(163, 124, 255, 0.2)",
      },
      "&.Mui-selected": {
        backgroundColor: "#a37cff",
        color: "#fff",
      },
    },
  },
};

const GererCoursPage = () => {
  const [cours, setCours] = useState([
    { id: 1, titre: "Mathématiques 101", professeur: "Paul Durand", dateDebut: "2023-09-01", duree: "3 mois" },
    { id: 2, titre: "Physique Avancée", professeur: "Sophie Leclerc", dateDebut: "2023-10-15", duree: "4 mois" },
    { id: 3, titre: "Histoire Moderne", professeur: "Marie Dupont", dateDebut: "2023-11-01", duree: "2 mois" },
  ]);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDelete = (id) => {
    setCours(cours.filter((c) => c.id !== id));
  };

  const handleAddClick = () => {
    navigate("/ajouter-cours");
  };

  const handleViewClick = (id) => {
    navigate(`/cours/${id}`);
  };

  const filteredCours = cours.filter((c) =>
    c.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.professeur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCours = filteredCours.slice((page - 1) * 5, page * 5);

  return (
    <Box sx={styles.content} aria-label="Gestion des cours">
      <Box sx={styles.header}>
        <Box sx={styles.titleContainer}>
          <Typography variant="h4" sx={styles.title} aria-label="Titre de la page">
            Gérer les Cours
          </Typography>
          <Typography variant="body2" sx={styles.courseCount}>
            Total : {filteredCours.length} cours
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="20px" flexWrap="wrap">
          <Button
            variant="contained"
            sx={styles.addButton}
            onClick={handleAddClick}
            startIcon={<Add />}
            aria-label="Ajouter un nouveau cours"
          >
            Ajouter
          </Button>
          <TextField
            sx={styles.searchField}
            variant="outlined"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#a37cff" }} />
                </InputAdornment>
              ),
            }}
            aria-label="Champ de recherche"
          />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table aria-label="Tableau des cours">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Professeur</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCours.map((c) => (
              <TableRow key={c.id} sx={styles.tableRow} aria-label={`Ligne pour ${c.titre}`}>
                <TableCell>{c.titre}</TableCell>
                <TableCell>{c.professeur}</TableCell>
                <TableCell>{c.dateDebut}</TableCell>
                <TableCell>{c.duree}</TableCell>
                <TableCell>
                  <Box sx={styles.actionButtons}>
                    <Tooltip title="Voir">
                      <IconButton
                        sx={styles.viewButton}
                        onClick={() => handleViewClick(c.id)}
                        aria-label={`Voir les détails de ${c.titre}`}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        sx={styles.deleteButton}
                        onClick={() => handleDelete(c.id)}
                        aria-label={`Supprimer ${c.titre}`}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={styles.pagination}
        count={Math.ceil(filteredCours.length / 5)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        aria-label="Pagination des cours"
      />
    </Box>
  );
};

export default GererCoursPage;