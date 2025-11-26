using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormBackend.Migrations
{
    /// <inheritdoc />
    public partial class RemovePasswordFromApplicationForm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "ApplicationForms");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
