import React, { useState } from "react";
import PersonModal from "./PersonModal";

function determineDisplay(expanded) {
    return expanded ? "flex" : "none"
}

export default function PersonRow(props) {
  const [expanded, updateExpanded] = useState(false);

  return (
    <tr key={props.person.Employee_ID} onClick={e => {updateExpanded(!expanded)}} style={{cursor: 'pointer'}}>
      <td>
        {props.person.First_Name} {props.person.Last_Name}
      </td>
      <td>{props.person.hours}</td>
      <td>{props.person.team_name.toString()}</td>
      <td>${props.person.pay.toFixed(2)}</td>
      <td>${(props.person.pay * props.person.hours).toFixed(2)}</td>
      <PersonModal person={props.person} show={expanded} invertExpanded={(e) => updateExpanded(!expanded)}></PersonModal>
    </tr>
  );
}
