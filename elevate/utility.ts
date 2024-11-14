export function toAst(cst: any) {
    if (!cst) {
        throw new Error("No CST to convert.");
    }
    // For demonstration purposes, just converting to a basic AST structure
    return {
        type: "Stateless Class",
        className: cst.className,
        property: cst.children.Property[0].image,
        modifiers: cst.children.ColonModifier.map((mod: any) => mod.image.replace(":", "")),
    };
}

