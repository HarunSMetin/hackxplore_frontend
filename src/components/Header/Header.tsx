import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Garbage Collection Management",
}) => (
  <AppBar
    position="static"
    elevation={0}
    sx={{
      bgcolor: "background.paper",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid #23262F",
    }}
  >
    <Toolbar>
      <Typography
        variant="h6"
        sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          alt="Admin"
          src="/avatar.png"
          sx={{ bgcolor: "primary.main", color: "white" }}
        />
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
