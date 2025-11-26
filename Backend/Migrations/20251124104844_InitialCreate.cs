using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AcademicDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CollegeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SchoolAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PreviousGrade = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Percentage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Profile = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcademicDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FamilyDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FatherName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherMobile = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherOccupation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MotherName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherMobile = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherOccupation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrimaryContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GuardianName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuardianRelation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuardianMobile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuardianEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuardianOccupation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnnualIncome = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationForms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Firstname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lastname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AlternateEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Bloodgroup = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryMobile = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AlternateMobile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmergencyContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyRelation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilyDetailsId = table.Column<int>(type: "int", nullable: false),
                    AcademicDetailsId = table.Column<int>(type: "int", nullable: false),
                    Agree = table.Column<bool>(type: "bit", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationForms_AcademicDetails_AcademicDetailsId",
                        column: x => x.AcademicDetailsId,
                        principalTable: "AcademicDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationForms_FamilyDetails_FamilyDetailsId",
                        column: x => x.FamilyDetailsId,
                        principalTable: "FamilyDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationForms");

            migrationBuilder.DropTable(
                name: "AcademicDetails");

            migrationBuilder.DropTable(
                name: "FamilyDetails");
        }
    }
}
