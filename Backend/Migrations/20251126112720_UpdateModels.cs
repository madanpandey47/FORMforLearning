using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
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

            migrationBuilder.DropColumn(
                name: "FatherEmail",
                table: "FamilyDetails");

            migrationBuilder.DropColumn(
                name: "GuardianEmail",
                table: "FamilyDetails");

            migrationBuilder.DropColumn(
                name: "GuardianOccupation",
                table: "FamilyDetails");

            migrationBuilder.DropColumn(
                name: "Profile",
                table: "AcademicDetails");

            migrationBuilder.DropColumn(
                name: "SchoolAddress",
                table: "AcademicDetails");

            migrationBuilder.RenameColumn(
                name: "MotherEmail",
                table: "FamilyDetails",
                newName: "FamilyType");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "ApplicationForms",
                newName: "Dob");

            migrationBuilder.AlterColumn<string>(
                name: "MotherOccupation",
                table: "FamilyDetails",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FatherOccupation",
                table: "FamilyDetails",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Bloodgroup",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalDocuments",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CitizenshipNumber",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Middlename",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PermanentAddressId",
                table: "ApplicationForms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PreferredContactMethod",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImage",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TemporaryAddressId",
                table: "ApplicationForms",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "Percentage",
                table: "AcademicDetails",
                type: "float",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CollegeName",
                table: "AcademicDetails",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ExtraCurricular",
                table: "AcademicDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PassingYear",
                table: "AcademicDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SchoolAddressId",
                table: "AcademicDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Province = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Municipality = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_PermanentAddressId",
                table: "ApplicationForms",
                column: "PermanentAddressId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_TemporaryAddressId",
                table: "ApplicationForms",
                column: "TemporaryAddressId",
                unique: true,
                filter: "[TemporaryAddressId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicDetails_SchoolAddressId",
                table: "AcademicDetails",
                column: "SchoolAddressId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicDetails_Addresses_SchoolAddressId",
                table: "AcademicDetails",
                column: "SchoolAddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationForms_Addresses_PermanentAddressId",
                table: "ApplicationForms",
                column: "PermanentAddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationForms_Addresses_TemporaryAddressId",
                table: "ApplicationForms",
                column: "TemporaryAddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AcademicDetails_Addresses_SchoolAddressId",
                table: "AcademicDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationForms_Addresses_PermanentAddressId",
                table: "ApplicationForms");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationForms_Addresses_TemporaryAddressId",
                table: "ApplicationForms");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_AcademicDetailsId",
                table: "ApplicationForms");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_FamilyDetailsId",
                table: "ApplicationForms");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_PermanentAddressId",
                table: "ApplicationForms");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationForms_TemporaryAddressId",
                table: "ApplicationForms");

            migrationBuilder.DropIndex(
                name: "IX_AcademicDetails_SchoolAddressId",
                table: "AcademicDetails");

            migrationBuilder.DropColumn(
                name: "AdditionalDocuments",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "CitizenshipNumber",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "Middlename",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "PermanentAddressId",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "PreferredContactMethod",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "ProfileImage",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "TemporaryAddressId",
                table: "ApplicationForms");

            migrationBuilder.DropColumn(
                name: "ExtraCurricular",
                table: "AcademicDetails");

            migrationBuilder.DropColumn(
                name: "PassingYear",
                table: "AcademicDetails");

            migrationBuilder.DropColumn(
                name: "SchoolAddressId",
                table: "AcademicDetails");

            migrationBuilder.RenameColumn(
                name: "FamilyType",
                table: "FamilyDetails",
                newName: "MotherEmail");

            migrationBuilder.RenameColumn(
                name: "Dob",
                table: "ApplicationForms",
                newName: "Country");

            migrationBuilder.AlterColumn<string>(
                name: "MotherOccupation",
                table: "FamilyDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FatherOccupation",
                table: "FamilyDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FatherEmail",
                table: "FamilyDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuardianEmail",
                table: "FamilyDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuardianOccupation",
                table: "FamilyDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bloodgroup",
                table: "ApplicationForms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Percentage",
                table: "AcademicDetails",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<string>(
                name: "CollegeName",
                table: "AcademicDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Profile",
                table: "AcademicDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SchoolAddress",
                table: "AcademicDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_AcademicDetailsId",
                table: "ApplicationForms",
                column: "AcademicDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationForms_FamilyDetailsId",
                table: "ApplicationForms",
                column: "FamilyDetailsId");
        }
    }
}
