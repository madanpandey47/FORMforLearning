using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormBackend.Migrations
{
    /// <inheritdoc />
    public partial class HandleAddressRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.CreateTable(
                name: "PermanentAddresses",
                columns: table => new
                {
                    StudentPID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Province = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Municipality = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PermanentAddresses", x => x.StudentPID);
                    table.ForeignKey(
                        name: "FK_PermanentAddresses_Students_StudentPID",
                        column: x => x.StudentPID,
                        principalTable: "Students",
                        principalColumn: "PID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TemporaryAddresses",
                columns: table => new
                {
                    StudentPID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Province = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Municipality = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemporaryAddresses", x => x.StudentPID);
                    table.ForeignKey(
                        name: "FK_TemporaryAddresses_Students_StudentPID",
                        column: x => x.StudentPID,
                        principalTable: "Students",
                        principalColumn: "PID",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PermanentAddresses");

            migrationBuilder.DropTable(
                name: "TemporaryAddresses");

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    StudentPID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Municipality = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Province = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => new { x.StudentPID, x.Id });
                    table.ForeignKey(
                        name: "FK_Addresses_Students_StudentPID",
                        column: x => x.StudentPID,
                        principalTable: "Students",
                        principalColumn: "PID",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
