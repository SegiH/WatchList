const exact = require("prop-types-exact");
const PropTypes = require("prop-types");
const React = require("react");
const ReactNode = require("react").ReactNode;
const useState = require("react").useState;

import { ReactNode } from "react";
import "./AccordionControl.css";

const AccordionControl = ({ accordionData }
     :
     {
          accordionData: Record<string, string>
     }) => {
     const [activeAccordionDataItem, setActiveAccordionDataItem] = useState("");

     const accordionControlClickHandler = (accordionDataItem: HTMLElement) => {
          if (accordionDataItem !== activeAccordionDataItem) {
               setActiveAccordionDataItem(accordionDataItem);
          } else {
               setActiveAccordionDataItem("");
          }
     };

     return (
          <>
               {Object.keys(accordionData).map((accordionDataItem: typeof ReactNode, index: number) => {
                    return (
                         <React.Fragment key={index}>
                              <button className="accordion" onClick={() => accordionControlClickHandler(accordionDataItem)}>
                                   {accordionDataItem}
                              </button>

                              <div className={`panel ${String(activeAccordionDataItem) === String(accordionDataItem) ? "activeAccordionControl" : ""}`}>
                                   <span className="textLabel">{accordionData[accordionDataItem]}</span>
                              </div>
                         </React.Fragment>
                    );
               })}
          </>
     );
};

AccordionControl.propTypes = exact({
     accordionData: PropTypes.object.isRequired,
});

export default AccordionControl;
