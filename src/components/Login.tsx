import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import TranslationContainer from "./Translation/TranslationContainer";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type OwnProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.SyntheticEvent) => void;
  values: { name: string; password: string };
  error: string;
};

export default function SignIn(props: OwnProps) {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <TranslationContainer translationKey="log_in" />
        </Typography>
        <form className={classes.form} onSubmit={props.onSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label={<TranslationContainer translationKey="name" />}
            name="name"
            autoComplete="name"
            autoFocus
            onChange={props.onChange}
            value={props.values.name}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={<TranslationContainer translationKey="password" />}
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={props.onChange}
            value={props.values.password}
          />
          {/*render error messages from server*/}
          <p style={{ color: "red" }}>{props.error}</p>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            <TranslationContainer translationKey="log_in" />
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link to="/signup">
                <TranslationContainer translationKey="no_account" />
              </Link>
              <Grid item>
                <Link to="/forgot-password">
                  <TranslationContainer translationKey="forgot" />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
