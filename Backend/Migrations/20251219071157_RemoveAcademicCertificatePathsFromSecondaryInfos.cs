using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormBackend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAcademicCertificatePathsFromSecondaryInfos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AcademicCertificatePaths",
                table: "SecondaryInfos",
                newName: "StudentIdCardPath");

            migrationBuilder.AddColumn<string>(
                name: "BoardCertificateImagePath",
                table: "SecondaryInfos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CitizenshipImagePath",
                table: "SecondaryInfos",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BoardCertificateImagePath",
                table: "SecondaryInfos");

            migrationBuilder.DropColumn(
                name: "CitizenshipImagePath",
                table: "SecondaryInfos");

            migrationBuilder.RenameColumn(
                name: "StudentIdCardPath",
                table: "SecondaryInfos",
                newName: "AcademicCertificatePaths");
        }
    }
}
