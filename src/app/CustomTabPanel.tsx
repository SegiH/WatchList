const Box = require("@mui/material/Box").default;
const exact = require("prop-types-exact");
const PropTypes = require("prop-types");
const React = require("react");
const ReactNode = require("react").ReactNode;
const Typography = require("@mui/material/Typography").default;

const CustomTabPanel = ({ children, index, other, value }
     :
     {
          children: typeof ReactNode,
          index: number,
          other: typeof ReactNode,
          value: number
     }) => {
     return (
          <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
               {value === index && (
                    <Box sx={{ p: 3 }}>
                         <Typography>{children}</Typography>
                    </Box>
               )}
          </div>
     );
};

CustomTabPanel.propTypes = exact({
     children: PropTypes.node,
     index: PropTypes.number.isRequired,
     other: PropTypes.node,
     value: PropTypes.number.isRequired,
});

export default CustomTabPanel;