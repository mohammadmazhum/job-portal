import { useState, useContext } from "react";
import { Grid, Button, TextField, LinearProgress } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import Axios from "axios";

import { SetPopupContext } from "../App";

const FileUploadInput = (props) => {
  const setPopup = useContext(SetPopupContext);

  const { uploadTo, identifier, handleInput } = props;

  const [file, setFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setUploadPercentage(0);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const data = new FormData();
    data.append("file", file);

    try {
      const response = await Axios.post(uploadTo, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadPercentage(percentage);
          }
        },
      });

      console.log("Upload response:", response.data);

      // Save uploaded file URL into signupDetails
      handleInput(identifier, response.data.url);

      setPopup({
        open: true,
        severity: "success",
        message: response.data.message || "File uploaded successfully",
      });
    } catch (err) {
      console.error("Upload error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        "File upload failed";

      setPopup({
        open: true,
        severity: "error",
        message: message,
      });

      setUploadPercentage(0);
    }
  };

  return (
    <Grid
      container
      item
      xs={12}
      direction="column"
      className={props.className}
    >
      <Grid container item xs={12} spacing={0}>
        {/* Select file */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {props.icon}

            <input
              type="file"
              hidden
              accept={props.accept || "*/*"}
              onChange={handleFileChange}
            />
          </Button>
        </Grid>

        {/* Selected file name */}
        <Grid item xs={6}>
          <TextField
            label={props.label}
            value={file ? file.name : ""}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            style={{
              width: "100%",
            }}
          />
        </Grid>

        {/* Upload button */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            style={{
              width: "100%",
              height: "100%",
            }}
            onClick={handleUpload}
            disabled={!file}
          >
            <CloudUpload />
          </Button>
        </Grid>
      </Grid>

      {uploadPercentage > 0 && uploadPercentage < 100 ? (
        <Grid
          item
          xs={12}
          style={{
            marginTop: "10px",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={uploadPercentage}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default FileUploadInput;