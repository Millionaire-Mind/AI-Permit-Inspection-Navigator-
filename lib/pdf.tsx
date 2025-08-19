import React from "react";

type ReportPdfProps = {
title?: string;
status?: string;
projectName?: string;
createdAt?: string;
};

// This component intentionally does NOT import @react-pdf/renderer.
// The route should import the renderer and wrap this content.
export function ReportPdfContent(props: ReportPdfProps) {
const { title = "Untitled", status = "unknown", projectName = "—", createdAt = "—" } = props;
// This is just a placeholder; in practice you'd return plain data and construct the PDF in the route.
return (
<>
{title}
Status: {status}
Project: {projectName}
Created: {createdAt}
</>
);
}