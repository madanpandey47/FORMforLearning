using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormBackend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveExplicitForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_AcademicDetailsId",
                table: "ApplicationForms");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_FamilyDetailsId",
                table: "ApplicationForms");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_AcademicDetailsId",
                table: "ApplicationForms",
                column: "AcademicDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_FamilyDetailsId",
                table: "ApplicationForms",
                column: "FamilyDetailsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_AcademicDetailsId",
                table: "ApplicationForms");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_FamilyDetailsId",
                table: "ApplicationForms");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_AcademicDetailsId",
                table: "ApplicationForms",
                column: "AcademicDetailsId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_FamilyDetailsId",
                table: "ApplicationForms",
                column: "FamilyDetailsId",
                unique: true);
        }
    }
}
